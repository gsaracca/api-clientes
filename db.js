const sql = require("mssql/msnodesqlv8");
require("dotenv").config({ path: "clientes.env" });

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  driver: "msnodesqlv8",
  options: {
    trustedConnection: false,
    charset: "utf8",
  },
};

let pool;
async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(dbConfig);
  return pool;
}

module.exports = { getPool, sql };
