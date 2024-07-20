const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/ticket-medio', ticketController.getTicketMedio);
router.get('/clientes-por-ticket-medio-intervalo', ticketController.getClientesPorTicketMedioIntervalo);
router.get('/clientes-com-menor-ticket-medio', ticketController.getClientesComMenorTicketMedio);
// router.get('/clientes-com-maior-ticket-medio', ticketController.getClientesComMaiorTicketMedio);
router.get('/compare-ticket-medio-periodos', ticketController.compareTicketMedioPeriodos);
module.exports = router;
