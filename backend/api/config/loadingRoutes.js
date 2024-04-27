'use strict'

let api = require('./apiConfiguration')
const Logger = require('../lib/Logger')
const path = require('path')
const { readdirSync, statSync } = require('fs')

Logger.trace('initing routes...', 'init')
const directory = './src'

const loadingResourse = (path) => {
  const resourse = require(`../${path}`)
  api = resourse(api)
}

const loadingRouteFiles = () => {
  function currentDirectory(routesDirectory) {
    const listFiles = readdirSync(routesDirectory)
    for (const file of listFiles) {

      const caminhoCompleto = path.join(routesDirectory, file)
      const estatisticas = statSync(caminhoCompleto)

      if (estatisticas.isDirectory()) {
        currentDirectory(caminhoCompleto)
      } else if (estatisticas.isFile() && file.includes('Route')) {
        loadingResourse(caminhoCompleto)
      }
    }
  }
  currentDirectory(directory)

  return api
}

loadingRouteFiles()

module.exports = api