const mongoOperator = require("../../database/mongo/mongoOperator")
const { connect, disconnect } = require("../../database/mongo/mongoose")
const { badRequest } = require("../../lib/errorResponses")
const coordenatesSchema = require("./coordenatesSchema")

module.exports.getCoordenates = async (req, res, next) => {
  const { query } = req
  const { value: filter, error: joiError } = await coordenatesSchema.validate(query)

  if (joiError) {
    return badRequest({ res, joiError })
  }

  await connect()

  const coordenates = await mongoOperator.get('peoples', filter)

  await disconnect()

  return res.send({
    pointsCounter: coordenates.length,
    points: coordenates
  })
}

module.exports.importCoordenates = async (req, res, next) => {

}
