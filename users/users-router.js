const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const UsersRouter = express.Router()
const jsonParser = express.json()
const sanitizeUser = user => ({
    id: user.id,
    name: xss(user.name),
    password: xss(user.password),
    pw_hint: xss(user.pw_hint),
    email: xss(user.email),
    number: xss(user.number)
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
        const {name, password, email} = req.body;
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
        newUser.pw_hint = pw_hint
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