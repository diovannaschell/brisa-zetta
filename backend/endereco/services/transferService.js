const { pool } = require('../config/postgres');
const { mongoClient, usuariosCollection } = require('../config/mongo');
const { getCoordinates, findFrequentBairro, findSimilarBairro, findSimilarStreet } = require('../helpers/helper');
const { readCheckpoint, writeCheckpoint } = require('../helpers/checkpoint');
const Cursor = require('pg-cursor');

async function transferData() {
  await mongoClient.connect();
  const client = await pool.connect();
  const { lastProcessedId } = readCheckpoint();

  try {
    const cursorQuery = lastProcessedId ? 
      `SELECT id, nome, endereco, bairro, municipio, uf FROM pessoas WHERE id > $1 ORDER BY id` :
      `SELECT id, nome, endereco, bairro, municipio, uf FROM pessoas ORDER BY id`;
    const cursor = lastProcessedId ? client.query(new Cursor(cursorQuery, [lastProcessedId])) : client.query(new Cursor(cursorQuery));

    const readNextBatch = () => {
      cursor.read(100, async (err, rows) => {
        if (err) {
          console.error('Erro ao ler dados do PostgreSQL', err);
          return cursor.close(() => client.release());
        }

        if (rows.length === 0) {
          console.log('Transferência concluída.');
          cursor.close(async () => {
            client.release();
            await mongoClient.close();
          });
          return;
        }

        for (let row of rows) {
          const { id, nome, endereco, bairro, municipio, uf } = row;
          let address = `${endereco}, ${bairro}, ${municipio}, ${uf}`;
          let coordinates = await getCoordinates(address);

          if (!coordinates) {
            // Tentar encontrar uma rua similar
            const similarStreet = await findSimilarStreet(endereco, municipio, uf);
            if (similarStreet) {
              address = `${similarStreet}, ${bairro}, ${municipio}, ${uf}`;
              coordinates = await getCoordinates(address);
            }
          }

          if (!coordinates) {
            // Tentar encontrar um bairro similar
            const similarBairro = await findSimilarBairro(bairro, municipio, uf);
            if (similarBairro) {
              address = `${endereco}, ${similarBairro}, ${municipio}, ${uf}`;
              coordinates = await getCoordinates(address);
            }
          }

          if (!coordinates) {
            address = `${bairro}, ${municipio}, ${uf}`;
            coordinates = await getCoordinates(address);
          }

          if (!coordinates) {
            address = `${municipio}, ${uf}`;
            coordinates = await getCoordinates(address);
          }

          if (!coordinates) {
            const frequentBairro = await findFrequentBairro(municipio, uf);
            if (frequentBairro) {
              address = `${frequentBairro}, ${municipio}, ${uf}`;
              coordinates = await getCoordinates(address);
            }
          }

          if (coordinates) {
            const { lat, lon } = coordinates;
            const existingUser = await usuariosCollection.findOne({ nome, endereco, bairro, municipio, uf });
            if (!existingUser) {
              await usuariosCollection.insertOne({
                nome, endereco, bairro, municipio, uf, latitude: lat, longitude: lon
              });
              console.log('Dados cadastrados:', { nome, endereco, bairro, municipio, uf, latitude: lat, longitude: lon });
            } else {
              console.log('Usuário já existe e não foi duplicado:', { nome, endereco, bairro, municipio, uf, latitude: lat, longitude: lon });
            }
          } else {
            console.log('Endereço não encontrado para:', { nome, endereco, bairro, municipio, uf });
          }
          writeCheckpoint(id); // Atualiza o checkpoint com o último ID processado
        }
        readNextBatch(); // Próximo lote
      });
    };

    readNextBatch(); // Iniciar a leitura do primeiro lote
  } catch (error) {
    console.error('Erro na transferência', error);
    client.release();
    await mongoClient.close();
  }
}

module.exports = { transferData };
