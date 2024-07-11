const Logger = require('../../lib/Logger')
const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'zetta',
  password: 'postgres',
  port: 5432,
})
const global = {}

module.exports.connect = async () => {
  if (global.connection) { // conexao já existe
    return global.connection.connect()
  }
  try {
    await pool.connect()
    global.connection = pool
    return pool.connect()
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-connect'
    })

    return null
  }
}

module.exports.close = async () => {
  try {
    delete global.connect
    return 'desconectado'
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-disconnect'
    })
  }
}