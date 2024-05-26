const Joi = require('joi')

const schema = Joi.object({
  state: Joi.string()
    .alphanum()
    .optional(),
  city: Joi.string()
    .alphanum()
    .optional(),
  neighborhood: Joi.string()
    .alphanum()
    .optional(),
})

module.exports.validate = async (body) => {
  return schema.validate(body)
}