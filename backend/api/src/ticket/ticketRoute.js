const { getTicketMedio } = require('./ticketController');

module.exports = (api) => {
  api.get('/ticketMedio', getTicketMedio);

  return api;
};
