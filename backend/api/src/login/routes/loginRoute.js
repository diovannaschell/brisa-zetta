'use strict'

const { login } = require('../controllers/loginController')

module.exports = (api) => {
    api.post('/login', login)

    return api
}