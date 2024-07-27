const { 
  getTicketMedio,
  getClientesPorTicketMedioIntervalo,
  getClientesComMenorTicketMedio,
  compareTicketMedioPeriodos
} = require('./ticketController');

module.exports = (api) => {
  api.get('/ticketMedio', getTicketMedio);
  api.get('/clientesPorTicketMedioIntervalo', getClientesPorTicketMedioIntervalo);
  api.get('/clientesComMenorTicketMedio', getClientesComMenorTicketMedio);
  api.get('/compareTicketMedioPeriodos', compareTicketMedioPeriodos);

  return api;
};
