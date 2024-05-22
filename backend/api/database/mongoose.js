'use strict'

const mongoose = require('mongoose')

require('dotenv/config')
const { MONGO_ADDRESS } = process.env

module.exports.connect = async () => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true }

  mongoose.connect(MONGO_ADDRESS, options)
    .then(() => console.log('Conectado ao MongoDB...'))
    .catch(err => console.error('Não foi possível conectar ao MongoDB...', err));
}

module.exports.disconnect = async () => {
  // const options = { useNewUrlParser: true, useUnifiedTopology: true }

  // mongoose.connect(MONGO_ADDRESS, options)
  //   .then(() => console.log('Conectado ao MongoDB...'))
  //   .catch(err => console.error('Não foi possível conectar ao MongoDB...', err));
}

