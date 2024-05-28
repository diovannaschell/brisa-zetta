// imports
const { getByCursor } = require('../database/postgres/postgresOperator')
const { connect, disconnect } = require('../database/mongo/mongoose')
const mo = require('../database/mongo/mongoOperator')
const axios = require('axios')

const importCoordenates = async () => {
  const query = `
    SELECT id, nome, cep, uf, municipio, bairro, endereco, complemento, numero, data_atualizacao 
    FROM pessoas 
    ORDER BY id
    limit 1000
  `
  const allPeoples = await getByCursor(query)
  let peoples = []
  let remainsPeoples = []

  await connect()

  for (let i = 0; i < allPeoples.length; i++) {
    //search for lat_lng field
    let address = `${allPeoples[i]?.endereco}, ${allPeoples[i]?.bairro}, ${allPeoples[i]?.municipio}, ${allPeoples[i]?.uf}`
    let coordinates = await _getCoordinates(address)

    if (coordinates == null) {
      // remainsPeoples.push(allPeoples[i])
      console.log(i)
      // console.log(`index: ${i} || pessoa sem endereco`)
    } else {
      allPeoples[i].location = {
        type: 'Point',
        coordinates: [
          parseFloat(coordinates.lon),
          parseFloat(coordinates.lat),
        ]
      }
      // peoples.push(allPeoples[i])
      try {
        await mo.new('peoples', allPeoples[i])
      } catch (error) {
        console.log(error.message)
      }

      // console.log(`index: ${i} || pessoa registrada`)
    }
    // if (i > ((allPeoples.length / 2) / 2)) console.log('25%')
    // if (i > (allPeoples.length / 2)) console.log('50%')
    // if (i > (allPeoples.length / 1.5)) console.log('75%')
  }

  // await mo.manyInsert('remainsPeoples', remainsPeoples)
  // await mo.manyInsert('peoples', peoples)
  await disconnect()

  console.log(`${peoples.length} pessoas registradas com sucesso.`)
  console.log(`${remainsPeoples.length} pessoas com endereco incompleto.`)

  console.log('transacao concluida')

  return true
}

importCoordenates()

const _getCoordinates = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
  const options = { validateStatus: () => true }
  try {
    const { data, status } = await axios.get(url, options)

    if (data.length < 1 || status != 200) {
      return null
    }

    return data[0]

  } catch (error) {
    return null
  }
}