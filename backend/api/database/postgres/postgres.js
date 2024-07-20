const Logger = require("../../lib/Logger");
const { Pool } = require("pg");

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

if (
  [POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_USER].some(
    (v) => !v
  )
) {
  throw new Error("Missing database environment variables");
}

const pool = new Pool({
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  port: POSTGRES_PORT,
});
const global = {};

module.exports.connect = async () => {
  if (global.connection) {
    // conexao já existe
    return global.connection.connect();
  }
  try {
    await pool.connect();
    global.connection = pool;
    return pool.connect();
  } catch (error) {
    Logger.error({
      ...error,
      type: "database-error",
      local: "postgre-connect",
    });

    return null;
  }
};

module.exports.close = async () => {
  try {
    delete global.connect;
    return "desconectado";
  } catch (error) {
    Logger.error({
      ...error,
      type: "database-error",
      local: "postgre-disconnect",
    });
  }
};
