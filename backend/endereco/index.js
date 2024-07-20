const express = require('express');
const { transferData } = require('./services/transferService');
const userController = require('./controllers/userController');
const ticketRouter = require('./routes/ticketRoutes');
const app = express();
const port = 3001;

app.use(express.json());

app.use('/api', ticketRouter)
app.use('/api/usuarios', userController);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  transferData();
});
