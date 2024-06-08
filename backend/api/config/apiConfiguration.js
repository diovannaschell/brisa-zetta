
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const api = express()

api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Origin', 'GET, PUT, POST, DELETE')
    api.use(cors())
    next()
})

api.use(
    bodyParser.urlencoded({
        extended: true
    })
)

module.exports = api
