const mongoose = require('mongoose')

require('dotenv/config')
const { MONGO_ADDRESS } = process.env


module.exports.connect = async () => {
  await mongoose.connect(MONGO_ADDRESS)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Não foi possível conectar ao MongoDB...', err));
}

module.exports.disconnect = async () => {
  mongoose.disconnect()
    .then(() => console.log('Desconectado do MongoDB!'))
    .catch(err => console.error('Não foi possível desconectar do MongoDB...', err));
}
