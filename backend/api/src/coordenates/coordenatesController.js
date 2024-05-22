'use strict'

const { connect } = require("../../database/mongoose")

module.exports.getCoordenates = async (req, res, next) => {

  await connect()

  return res.send('sim')
}
