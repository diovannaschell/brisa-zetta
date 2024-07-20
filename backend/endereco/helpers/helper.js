const fetch = require('node-fetch');
const stringSimilarity = require('string-similarity');
const { usuariosCollection } = require('../config/mongo');

async function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

async function findFrequentBairro(municipio, uf) {
  const frequentBairro = await usuariosCollection.aggregate([
    { $match: { municipio, uf } },
    { $group: { _id: "$bairro", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]).toArray();
  return frequentBairro.length > 0 ? frequentBairro[0]._id : null;
}

async function findSimilarBairro(bairro, municipio, uf) {
  const bairros = await usuariosCollection.distinct("bairro", { municipio, uf });
  if (bairros.length === 0) {
    return null;
  }
  const matches = stringSimilarity.findBestMatch(bairro, bairros);
  return matches.bestMatch.target;
}

async function findSimilarStreet(street, municipio, uf) {
  const streets = await usuariosCollection.distinct("endereco", { municipio, uf });
  if (streets.length === 0) {
    return null;
  }
  const matches = stringSimilarity.findBestMatch(street, streets);
  return matches.bestMatch.target;
}

module.exports = { getCoordinates, findFrequentBairro, findSimilarBairro, findSimilarStreet };
