'use strict'

const Joi = require('joi')
const SchemaValidation = require('../../lib/SchemaValidation')

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(2)
    .max(50)
    .required(),

  password: Joi.string()
    .alphanum(),
})

module.exports.validate = async (body) => {
  return SchemaValidation(schema.validate(body))
}