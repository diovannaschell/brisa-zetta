const express = require('express');
const { transferData } = require('./services/transferService');
const userController = require('./controllers/userController');
const ticketRouter = require('./routes/ticketRoutes');
const cors = require('cors');
const app = express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(express.json());
app.use(cors(corsOptions));

app.use(ticketRouter);
app.use(userController);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  transferData();
});
