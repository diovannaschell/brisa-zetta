const Logger = require('../../lib/Logger')
const redirect = require('./mongoRedirect')

const options = {
  lean: true,
  new: true
}

module.exports.get = async (model, filter = {}, projection = {}) => {
  if (!model) {
    throw new Error('unknow model')
  }

  const response = await redirect[model].find(filter, projection, options)

  Logger.trace(`get operation executed with ${response.length} results`)

  return response
}

module.exports.new = async (model, document) => {
  if (!model) {
    throw new Error('unknow model')
  }

  const response = await redirect[model].create(document)

  Logger.trace('save operation executed successfully.')

  return response
}

module.exports.manyInsert = async (model, documents) => {
  if (!model) {
    throw new Error('unknow model')
  }

  try {
    const response = await redirect[model].insertMany(documents, { ordered: false, lean: true, })

    Logger.trace('operation of many insertions possibly executed successfully.')

    return response
  } catch (error) {
    Logger.error(error.message)
    return
  }
}

module.exports.edit = async (model, filter, document) => {
  if (!model) {
    throw new Error('unknow model')
  }

  const response = await redirect[model].findOneAndUpdate(filter, { $set: document }, options)

  Logger.trace('update operation executed successfully.')

  return response
}

module.exports.delete = async (model, filter) => {
  if (!model) {
    throw new Error('unknow model')
  }

  const response = await redirect[model].deleteOne(filter)

  Logger.trace('delete operation executed successfully')

  return response
}