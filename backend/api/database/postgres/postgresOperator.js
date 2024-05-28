const pg = require('./postgres')

module.exports = ({
  getByCursor: async (query) => {
    const client = await pg.connect()
    if (!client) {
      console.log('pg client is null')
      return null
    }

    let res = null

    try {
      res = await client.query(query)
    } catch (error) {
      console.log(error.message)

      return
    } finally {
      await client.release()
      await pg.close()
    }

    if (res.rowCount >= 1) {
      return res.rows
    }

    return null
  }
})