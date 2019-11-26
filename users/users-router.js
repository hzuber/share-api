const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const UsersRouter = express.Router()
const jsonParser = express.json()
const sanitizeUser = (user) => ({
    id: user.id,
    name: xss(user.name),
    password: xss(user.password),
    email: xss(user.email),
    number: xss(user.number)
})
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

UsersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
            .then(users =>
                res.json(users.map(sanitizeUser))
            )
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name, password, email, number } = req.body;
        const newUser = {name, password, email};

        for(const [key, value] of Object.entries(newUser)){
            if(value == null){
                return res.status(400).json({
                    error: {
                        message: `You are missing '${key}' in request body.`
                    }
                })
            }
        }
        newUser.number = number;
        UsersService.addUser(
            req.app.get('db'),
            newUser
        )
        .then(user => {
            res.status(201)
                .location(path.posix.join(req.originalUrl + `/${user.id}`))
                .json(sanitizeUser(user))
        })
        .catch(next)
    })

UsersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.user_id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: {
                            message: `User doesn't exist`
                        }
                    })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(sanitizeUser(res.user))
    })
    .delete((req, res, next) => {
        UsersService.deleteUser(
            req.app.get('db'),
            req.params.user_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, password, email, number } = req.body
        const userToUpdate = { name, password, email, number }

        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request must contain a change`
                }
            })
        }

        UsersService.updateUser(
            req.app.get('db'),
            req.params.user_id,
            userToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

UsersRouter
    .route('/:user_id/items') 
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.user_id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: {
                            message: `User doesn't exist`
                        }
                    })
                }
                res.user = user
                next()
                return user
            })
            .catch(next)
    })
    .get((req, res, next) => {
        UsersService.getItemsByUserId(
            req.app.get('db'),
            req.params.user_id
        )
        .then(items => {
            res.json(items.map(sanitizeItem))
        })
        .catch(next)
    })

module.exports = UsersRouter