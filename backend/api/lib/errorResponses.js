const Logger = require("./Logger")

module.exports = ({
  badRequest: ({ res, message, joiError }) => {
    if (!message) {
      message = 'unknow error'
    }

    if (joiError) {
      message = joiError.details[0].message
    }

    Logger.error(`error 400 :: ${message}`)
    return res.status(400).send(message)
  },

  notFound: ({ res, message }) => {
    if (!message) {
      message = 'unknow error'
    }

    Logger.error(`error 404 :: ${message}`)
    return res.status(404).send(message)
  }
})