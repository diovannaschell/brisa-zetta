'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const api = express()

api.use(cors()) // Enables CORS for all origins, methods, and headers
api.use(express.urlencoded({ extended: true }))
api.use(express.json()) // Ensures you can parse JSON payloads

api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Origin', 'GET, PUT, POST, DELETE')
    api.use(cors())
    next()
})

api.use(
    bodyParser.urlencoded({
        extended: true
    })
)

module.exports = api
