'use strict'

const loginSchema = require("./loginSchema")

module.exports.login = async (req, res, next) => {
  const { body } = req
  await loginSchema.validate(body, res)

  return res.send('sim')
}
