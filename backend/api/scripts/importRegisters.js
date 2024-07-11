// imports
const { getByCursor } = require('../database/postgres/postgresOperator')
const { connect, disconnect } = require('../database/mongo/mongoose')
const mo = require('../database/mongo/mongoOperator')
const Logger = require('../lib/Logger')

const importRegisters = async () => {
  const query = `
    SELECT id, nome, cep, uf, municipio, bairro, endereco, complemento, numero, data_atualizacao 
    FROM pessoas 
    ORDER BY id
  `
  const res = await getByCursor(query)

  await connect()

  Logger.trace(`data geted by postgres db ${res.length}`)
  await mo.manyInsert('coordenates', res)
  Logger.trace('data saved in mongo db')

  await disconnect()

  return true
}

importRegisters()