
const { getCoordenates, importCoordenates } = require('./coordenatesController')

module.exports = (api) => {
  api.get('/coordenates', getCoordenates)

  api.post('/coordenates/import', importCoordenates)

  return api
}