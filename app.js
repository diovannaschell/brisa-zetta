const express = require('express');
const { Pool } = require('pg');
const Cursor = require('pg-cursor');
const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

const app = express();
const port = 3001;
app.use(express.json());


// Configuração do PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'zettaBrasil',
  password: 'root',
  port: 5432
});

// Configuração do MongoDB
const mongoClient = new MongoClient('mongodb://localhost:27017/zettaBrasil');
const mongoDb = mongoClient.db('zettaBrasil');
const usuariosCollection = mongoDb.collection('zetta');

async function transferData() {
  await mongoClient.connect();
  const client = await pool.connect();
  try {
    const cursor = client.query(new Cursor('SELECT nome, endereco, bairro, municipio, uf FROM pessoas'));
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
          const { nome, endereco, bairro, municipio, uf } = row;
          const address = `${endereco}, ${bairro}, ${municipio}, ${uf}`;
          const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.length > 0) {
            const { lat, lon } = data[0];
            const existingUser = await usuariosCollection.findOne({ nome, endereco, bairro,municipio, uf });
            if (!existingUser) {
              await usuariosCollection.insertOne({
                nome, endereco, bairro,municipio, uf, latitude: lat, longitude: lon
              });
              console.log('Dados cadastrados:', { nome, endereco, bairro,municipio, uf, latitude: lat, longitude: lon });
            } else {
              console.log('Usuário já existe e não foi duplicado:', { nome, endereco, bairro,municipio, uf, latitude : lat, longitude: lon});
            }
          } else {
            console.log('Endereço não encontrado para:', { nome, endereco, bairro, municipio, uf});
          }
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

app.post('/api/usuarios', async (req, res) => {
    const { nome, endereco, bairro, municipio, uf } = req.body;
    // Verifica se todos os dados necessários foram fornecidos
    if (!nome || !endereco || !bairro || !municipio || !uf) {
      return res.status(400).json({ error: 'Faltam informações necessárias para o cadastro.' });
    }

    const address = `${endereco}, ${bairro}, ${municipio}, ${uf}`;

    // Verifica se o usuário já existe no banco de dados
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Verifica se o endereço foi encontrado
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newUser = {
          nome, endereco, bairro,municipio, uf, latitude: lat, longitude: lon
        };

        const existingUser = await usuariosCollection.findOne({ nome, endereco, bairro,municipio, uf });
        if (!existingUser) {
        // Insere o novo usuário no banco de dados MongoDB
            await usuariosCollection.insertOne(newUser);
            res.status(201).json(newUser); // Retorna o novo usuário cadastrado
        }
      } else {
        res.status(404).json({ error: 'Endereço não encontrado.' });
      }
    } catch (error) {
      // Captura erros gerais, como problemas de rede ou na API
      console.error('Erro ao salvar no MongoDB', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
app.delete('/api/remove-duplicatas', async (req, res) => {
    try {
        // Encontrar todos os usuários e agrupá-los por nome, endereco e bairro
        const aggregation = await usuariosCollection.aggregate([
            {
                $group: {
                    _id: { nome: "$nome", endereco: "$endereco", bairro: "$bairro", municipio: "$municipio", uf: "$uf"},
                    uniqueIds: { $addToSet: "$_id" },
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]).toArray();

        // Itera sobre cada grupo de duplicatas
        for (const group of aggregation) {
            // Mantém o primeiro ID e remove os demais
            const idsToKeep = group.uniqueIds.slice(0, 1);
            const idsToRemove = group.uniqueIds.slice(1);
            
            // Remove duplicatas, mantendo apenas um documento
            await usuariosCollection.deleteMany({ _id: { $in: idsToRemove } });
        }

        res.status(200).json({ message: 'Duplicatas removidas com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover duplicatas', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get('/api/locations', async (req, res) => {
    try {
        const users = await usuariosCollection.find({}).project({ nome: 1, latitude: 1, longitude: 1 }).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar localizações', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/delete-all', async (req, res) => {
  try {
      // Remove todos os documentos da coleção 'usuarios'
      await usuariosCollection.deleteMany({});

      // Alternativamente, você pode querer excluir a coleção inteira, descomente a linha abaixo para fazer isso
      // await usuariosCollection.drop();

      res.status(200).json({ message: 'Todos os dados foram excluídos com sucesso.' });
  } catch (error) {
      console.error('Erro ao excluir dados', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  transferData(); // Inicia o processo de transferência quando o servidor é iniciado
});
