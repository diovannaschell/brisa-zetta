const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PeoplesSchema = new Schema({
  id: Number,
  nome: String,
  cep: String,
  uf: String,
  municipio: String,
  bairro: String,
  endereco: String,
  complemento: String,
  numero: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0] // Devido ao 2dsphere index, é necessário colocar [longitude, latitude]
    }
  },
}, {
  timestamps: { createdAt: 'data_criacao', updatedAt: 'data_atualizacao' },
  id: false,
  versionKey: false,
})

PeoplesSchema.index({ id: 1 }, { unique: true })
PeoplesSchema.index({ nome: 'text' }, { default_language: 'pt-br' })
PeoplesSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Peoples', PeoplesSchema)