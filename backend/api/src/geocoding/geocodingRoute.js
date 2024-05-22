'use strict'

const { translateGeolocations } = require('./geocodingController')

module.exports = (api) => {
  api.put('/translate_geolocations', translateGeolocations)

  return api
}