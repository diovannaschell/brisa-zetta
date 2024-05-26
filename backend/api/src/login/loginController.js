const { badRequest, notFound } = require("../../interfaces/errorResponses")
const jwt = require("../../lib/jwt")
const loginSchema = require("./loginSchema")

module.exports.login = async (req, res, next) => {
  const { body } = req
  const { value, error } = await loginSchema.validate(body)

  if (error) {
    return badRequest({ res, joiError: error })
  }

  /**
   * code to consult zetta api=>login to consult any informations
   * in this code, validations are necessary
   */

  const loginFail = await _localLoginValidate(value, res)
  if (loginFail) {
    return loginFail
  }

  const payloadToTokenize = {
    access: 'client',
    ...value
  }

  const token = await jwt.signToken(payloadToTokenize)

  return res.send({ message: 'login successfully', token })
}

const _localLoginValidate = async (body, res) => {
  if (body.username !== 'admin') {
    return notFound({ message: 'user not found', res })
  }

  if (body.password !== 'admin') {
    return notFound({ message: 'password incorrect', res })
  }

  return false
}