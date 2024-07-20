
const { getStatistics } = require('./statisticsController')

module.exports = (api) => {
  api.get('/statistcs', getStatistics)

  return api
}