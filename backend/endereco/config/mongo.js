const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient('mongodb://localhost:27017/zettaBrasil');
const mongoDb = mongoClient.db('zettaBrasil');
const usuariosCollection = mongoDb.collection('zetta');

module.exports = { mongoClient, mongoDb, usuariosCollection };
