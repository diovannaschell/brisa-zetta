const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CoordenatesSchema = new Schema({
  name: String,
  state: String,
  city: String,
  neighborhood: String,
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
  description: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

CoordenatesSchema.index({ name: 'text' })
CoordenatesSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Coordenates', CoordenatesSchema)