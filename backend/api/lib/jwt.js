const jwt = require('jsonwebtoken')

const secret = 'segredo eim'

module.exports = ({
  signToken: async (payload) => {
    return jwt.sign(payload, secret)
  },

  decodeToken: (token) => {
    return jwt.verify(token, secret)
  }
})
