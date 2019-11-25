require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { CLIENT_ORIGIN, NODE_ENV } = require('./config')
const helmet = require('helmet');
const shareRouter = require('./shareRouter')
const UsersRouter = require('../users/users-router')
const ItemsRouter = require('../items/items-router')

const app = express()

const morganOption = (NODE_ENV === 'production' ? 'tiny' : 'common');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/share-my-stuff', shareRouter)
app.use('/api/users', UsersRouter)
app.use('/api/items', ItemsRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

/*app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log(apiToken)
    console.log(authToken)
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`)
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })*/

/*app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: {message: 'server error' } }
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})*/

module.exports = app;