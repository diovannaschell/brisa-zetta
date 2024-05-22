'use strict'

const { getCoordenates } = require('./coordenatesController')

module.exports = (api) => {
  api.get('/coordenates', getCoordenates)

  return api
}