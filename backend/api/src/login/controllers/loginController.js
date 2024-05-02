'use strict'
login = require('../service/loginService')

const loginService = require('../service/loginService')
const { validationResult } = require('express-validator')
const { response } = require('express')
const { createToken } = require('../auth/authService')

const login = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await loginService.login(req.body)
        if (user) {
            const token = createToken(user)
            return res.status(200).json({ token })
        }
        return res.status(401).json({ message: 'Usuário ou senha inválidos' })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao realizar login' })
    }
}


module.exports.login = async (req, res, next) => {

    return res.send('sim')
}
