const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RemainsPeoplesSchema = new Schema({
  id: Number,
  nome: String,
  cep: String,
  uf: String,
  municipio: String,
  bairro: String,
  endereco: String,
  complemento: String,
  numero: String,
}, {
  timestamps: { createdAt: 'data_criacao', updatedAt: 'data_atualizacao' },
  id: false,
  versionKey: false,
})

RemainsPeoplesSchema.index({ id: 1 }, { unique: true })
RemainsPeoplesSchema.index({ nome: 'text' }, { default_language: 'pt-br' })

module.exports = mongoose.model('RemainsPeoples', RemainsPeoplesSchema)