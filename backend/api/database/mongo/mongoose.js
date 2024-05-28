const mongoose = require('mongoose')

require('dotenv/config')
const { MONGO_ADDRESS } = process.env
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
}

module.exports.connect = async () => {
  await mongoose.connect(MONGO_ADDRESS, options)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Não foi possível conectar ao MongoDB...', err));
}

module.exports.disconnect = async () => {
  mongoose.disconnect()
    .then(() => console.log('Desconectado do MongoDB!'))
    .catch(err => console.error('Não foi possível desconectar do MongoDB...', err));
}
