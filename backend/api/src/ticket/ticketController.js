const { Pool } = require('pg');
const moment = require('moment');
const { badRequest } = require("../../lib/errorResponses");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'zettaBrasil',
  password: 'root',
  port: 5432,
});

module.exports = {
  getTicketMedio: async (req, res, next) => {
    const { data } = req.query;

    if (!data) {
      return badRequest({ res, message: 'Data is required' });
    }

    if (!moment(data, 'YYYY-MM', true).isValid()) {
      return badRequest({ res, message: 'Invalid date format. Use YYYY-MM.' });
    }

    try {
      const client = await pool.connect();
      const startDate = moment(data, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
      const endDate = moment(data, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

      const result = await client.query(`
        SELECT AVG(venda_total) AS ticketMedio
        FROM (
          SELECT cli_cod, SUM(notsai_val_tot) AS venda_total
          FROM "NOTAS_SAIDAS"
          WHERE notsai_tpo != 'T'
            AND cli_cod IS NOT NULL
            AND notsai_dat >= $1
            AND notsai_dat <= $2
          GROUP BY cli_cod
        ) AS vendas
      `, [startDate, endDate]);

      client.release();

      if (result.rows.length === 0) {
        return res.send({ ticketMedio: 0 });
      }

      return res.send({ ticketMedio: result.rows[0].ticketmedio });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getClientesPorTicketMedioIntervalo: async (req, res, next) => {
    const { data, min, max } = req.query;

    if (!data || !min || !max) {
      return badRequest({ res, message: 'Data, min and max are required' });
    }

    if (!moment(data, 'YYYY-MM', true).isValid()) {
      return badRequest({ res, message: 'Invalid date format. Use YYYY-MM.' });
    }

    try {
      const client = await pool.connect();
      const startDate = moment(data, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
      const endDate = moment(data, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

      const result = await client.query(`
        SELECT cli_cod, AVG(venda_total) AS ticketMedio
        FROM (
          SELECT cli_cod, SUM(notsai_val_tot) AS venda_total
          FROM "NOTAS_SAIDAS"
          WHERE notsai_tpo != 'T'
            AND cli_cod IS NOT NULL
            AND notsai_dat >= $1
            AND notsai_dat <= $2
          GROUP BY cli_cod
        ) AS vendas
        GROUP BY cli_cod
        HAVING AVG(venda_total) BETWEEN $3 AND $4
      `, [startDate, endDate, min, max]);

      client.release();

      if (result.rows.length === 0) {
        return res.send([]);
      }

      return res.send(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getClientesComMenorTicketMedio: async (req, res, next) => {
    const { data, limite } = req.query;

    if (!data || !limite) {
      return badRequest({ res, message: 'Data and limite are required' });
    }

    if (!moment(data, 'YYYY-MM', true).isValid()) {
      return badRequest({ res, message: 'Invalid date format. Use YYYY-MM.' });
    }

    try {
      const client = await pool.connect();
      const startDate = moment(data, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
      const endDate = moment(data, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

      const result = await client.query(`
        SELECT cli_cod, AVG(venda_total) AS ticketMedio
        FROM (
          SELECT cli_cod, SUM(notsai_val_tot) AS venda_total
          FROM "NOTAS_SAIDAS"
          WHERE notsai_tpo != 'T'
            AND cli_cod IS NOT NULL
            AND notsai_dat >= $1
            AND notsai_dat <= $2
          GROUP BY cli_cod
        ) AS vendas
        GROUP BY cli_cod
        ORDER BY ticketMedio ASC
        LIMIT $3
      `, [startDate, endDate, limite]);

      client.release();

      if (result.rows.length === 0) {
        return res.send([]);
      }

      return res.send(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  compareTicketMedioPeriodos: async (req, res, next) => {
    const { data1, data2 } = req.query;

    if (!data1 || !data2) {
      return badRequest({ res, message: 'Both periods are required' });
    }

    if (!moment(data1, 'YYYY-MM', true).isValid() || !moment(data2, 'YYYY-MM', true).isValid()) {
      return badRequest({ res, message: 'Invalid date format. Use YYYY-MM.' });
    }

    try {
      const client = await pool.connect();
      const startDate1 = moment(data1, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
      const endDate1 = moment(data1, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');
      const startDate2 = moment(data2, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
      const endDate2 = moment(data2, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

      const result = await client.query(`
        SELECT
          (SELECT AVG(venda_total) FROM (
            SELECT cli_cod, SUM(notsai_val_tot) AS venda_total
            FROM "NOTAS_SAIDAS"
            WHERE notsai_dat >= $1 AND notsai_dat <= $2
            GROUP BY cli_cod
          ) AS vendas) AS ticketMedio1,
          (SELECT AVG(venda_total) FROM (
            SELECT cli_cod, SUM(notsai_val_tot) AS venda_total
            FROM "NOTAS_SAIDAS"
            WHERE notsai_dat >= $3 AND notsai_dat <= $4
            GROUP BY cli_cod
          ) AS vendas) AS ticketMedio2
      `, [startDate1, endDate1, startDate2, endDate2]);

      client.release();

      return res.send({
        periodo1: data1,
        periodo2: data2,
        ticketMedioPeriodo1: result.rows[0].ticketmedio1 || 0,
        ticketMedioPeriodo2: result.rows[0].ticketmedio2 || 0,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
};
