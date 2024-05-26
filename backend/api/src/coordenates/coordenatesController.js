const mongoOperator = require("../../database/mongo/mongoOperator")
const { connect, disconnect } = require("../../database/mongo/mongoose")
const { badRequest } = require("../../interfaces/errorResponses")
const coordenatesSchema = require("./coordenatesSchema")

module.exports.getCoordenates = async (req, res, next) => {
  const { query } = req
  const { value: filter, error: joiError } = await coordenatesSchema.validate(query)

  if (joiError) {
    return badRequest({ res, joiError })
  }

  await connect()

  const coordenates = await mongoOperator.get('coordenates', filter)

  await disconnect()

  return res.send({
    pointsCounter: coordenates.length,
    points: coordenates
  })
}
