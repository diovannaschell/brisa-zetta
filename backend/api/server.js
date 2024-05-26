
require('dotenv/config')
const { PORT } = process.env

const api = require('./config/loadingRoutes')

const Logger = require('./lib/Logger')

api.listen(PORT, () => {
  Logger.trace(`Api rodando na porta: ${PORT}`)
})
