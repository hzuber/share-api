const path = require('path')
const express = require('express')
const xss = require('xss')
const ItemsService = require('./items-service')
const { requireAuth } = require('../auth/middleware/basic-auth')

const ItemsRouter = express.Router()
const jsonParser = express.json()
const sanitizeItem = (item) => ({
    id: item.id,
    name: xss(item.name),
    author: xss(item.author),
    type: item.type,
    borrowed: item.borrowed,
    borrowed_by: xss(item.borrowed_by),
    borrowed_since: item.borrowed_since,
    owned_by: item.owned_by,
    description: xss(item.description)
})

ItemsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ItemsService.getAllItems(knexInstance)
            .then(items =>
                res.json(items.map(sanitizeItem))
            )
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const {name, type, author, borrowed, borrowed_by, borrowed_since, description, owned_by} = req.body;
        const newItem = {name, borrowed, owned_by};

        for(const [key, value] of Object.entries(newItem)){
            if(value == null){
                return res.status(400).json({
                    error: {
                        message: `You are missing '${key}' in request body.`
                    }
                })
            }
        }
        newItem.type = type;
        newItem.author = author;
        newItem.borrowed_by = borrowed_by;
        newItem.borrowed_since = borrowed_since;
        newItem.description = description;
        ItemsService.addItem(
            req.app.get('db'),
            newItem
        )
        .then(item => {
            res.status(201)
                .location(path.posix.join(req.originalUrl + `/${item.id}`))
                .json(sanitizeItem(item))
        })
        .catch(next)
    })

ItemsRouter
    .route('/:item_id')
    .all(requireAuth)
    .all((req, res, next) => {
        ItemsService.getById(
            req.app.get('db'),
            req.params.item_id
        )
            .then(item => {
                if (!item) {
                    return res.status(404).json({
                        error: {
                            message: `Item doesn't exist`
                        }
                    })
                }
                res.item = item
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(sanitizeItem(res.item))
    })
    .delete((req, res, next) => {
        ItemsService.deleteItem(
            req.app.get('db'),
            req.params.item_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, type, author, borrowed, borrowed_by, borrowed_since, description, owned_by } = req.body
        const itemToUpdate = { name, type, author, borrowed, borrowed_by, borrowed_since, description, owned_by }

        const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request must contain a change`
                }
            })
        }

        ItemsService.updateItem(
            req.app.get('db'),
            req.params.item_id,
            itemToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = ItemsRouter