'use strict'

const { login } = require('./loginController')

module.exports = (api) => {
    api.post('/login', login)

    return api
}