const mongoOperator = require("../../database/mongo/mongoOperator");
const { connect, disconnect } = require("../../database/mongo/mongoose");
const { badRequest } = require("../../lib/errorResponses");

module.exports.getTicketMedio = async (req, res, next) => {
  const { query } = req;
  const { data } = query;

  if (!data) {
    return badRequest({ res, message: 'Data is required' });
  }

  await connect();

  // Consulta para calcular o ticket médio
  const result = await mongoOperator.aggregate('NOTAS_SAIDAS', [
    {
      $match: {
        notsai_tpo: { $ne: 'T' },
        cli_cod: { $ne: null },
        notsai_dat: {
          $gte: new Date(`${data}-01`),  // Assumindo que a data é no formato 'YYYY-MM'
          $lt: new Date(`${data}-31`)
        }
      }
    },
    {
      $group: {
        _id: '$cli_id',
        venda_total: { $sum: '$notsai_val_tot' }
      }
    },
    {
      $group: {
        _id: null,
        ticketMedio: { $avg: '$venda_total' }
      }
    }
  ]);

  await disconnect();

  if (result.length === 0) {
    return res.send({ ticketMedio: 0 });
  }

  return res.send({ ticketMedio: result[0].ticketMedio });
};
