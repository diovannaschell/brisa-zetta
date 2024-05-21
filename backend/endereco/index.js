const express = require('express');
const { transferData } = require('./services/transferService');
const userController = require('./controllers/userController');
const app = express();
const port = 3001;

app.use(express.json());

app.use('/api/usuarios', userController);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  transferData(); // Inicia o processo de transferência quando o servidor é iniciado
});
