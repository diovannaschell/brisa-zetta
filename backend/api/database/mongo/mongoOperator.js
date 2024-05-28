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

  return response
}

module.exports.new = async (model, document) => {
  if (!model) {
    throw new Error('unknow model')
  }

  const response = await redirect[model].create(document)

  return response
}

module.exports.manyInsert = async (model, documents) => {
  if (!model) {
    throw new Error('unknow model')
  }

  try {
    const response = await redirect[model].insertMany(documents, { ordered: false, lean: true, })

    return response
  } catch (error) {
    console.log(error.message)
    return 
  }
}

module.exports.edit = async (model, filter, document) => {
  if (!model) {
    throw new Error('unknow model')
  }

  const response = await redirect[model].findOneAndUpdate(filter, { $set: document }, options)

  return response
}

module.exports.delete = async (model, filter) => {
  if (!model) {
    throw new Error('unknow model')
  }

  const response = await redirect[model].deleteOne(filter)

  return response
}