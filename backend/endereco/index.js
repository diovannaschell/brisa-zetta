// index.js
const express = require('express');
const { Pool } = require('pg');
const { transferData, handlePostgresNotification } = require('./services/transferService');
const userController = require('./controllers/userController');
const app = express();
const port = 3001;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // Certifique-se de que o hostname está correto
  database: 'zettaBrasil',
  password: 'root',
  port: 5432,
});

app.use(express.json());
app.use('/api/usuarios', userController);

pool.connect((err, client) => {
  if (err) throw err;
  client.query('LISTEN address_update');

  client.on('notification', async (msg) => {
    const payload = JSON.parse(msg.payload);
    try {
      await handlePostgresNotification(payload);
    } catch (error) {
      console.error('Error handling PostgreSQL notification:', error);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  transferData(); // Inicia o processo de transferência quando o servidor é iniciado
});
