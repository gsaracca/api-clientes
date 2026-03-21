"use strict";

// 1) Cargar variables de entorno
require("dotenv").config({ path: "clientes.env" });

// 2) Imports (UNA sola vez)
const express = require("express");

// 3) App
const app = express();
app.use(express.json());

// 👇 frontend
app.use(express.static("public"));

const cors = require("cors");
app.use(cors());

const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// DB helpers are in ./db.js so tests can mock getPool
const { getPool, sql } = require("./db");

// --- Validación básica
function validateCliente(body) {
  const errors = [];
  const required = ["razon_social", "cuit", "domicilio", "tipo_iva"];

  for (const f of required) {
    if (
      body[f] === undefined ||
      body[f] === null ||
      String(body[f]).trim() === ""
    ) {
      errors.push(`Falta campo obligatorio: ${f}`);
    }
  }

  if (body.cuit !== undefined) {
    const cuit = String(body.cuit).trim();
    if (!/^\d{11}$/.test(cuit))
      errors.push("cuit debe tener 11 dígitos numéricos (sin guiones).");
  }

  return errors;
}

// 5) Healthcheck con DB
app.get("/health", async (req, res) => {
  try {
    const p = await getPool();
    const r = await p.request().query("SELECT 1 AS ok");
    res.json({ ok: true, db: r.recordset[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

// ============================
// CRUD CLIENTES
// ============================

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// GET /api/clientes?q=texto
app.get("/api/clientes", async (req, res) => {
  try {
    const p = await getPool();
    const q = (req.query.q || "").toString().trim();

    const request = p.request();
    let query = `
      SELECT id_cliente, razon_social, cuit, domicilio, tipo_iva
      FROM Clientes
    `;

    if (q) {
      query += `
        WHERE razon_social LIKE @q
           OR cuit LIKE @q
           OR domicilio LIKE @q
           OR tipo_iva LIKE @q
      `;
      request.input("q", sql.NVarChar(200), `%${q}%`);
    }

    query += ` ORDER BY razon_social ASC`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// GET /api/clientes/:id
app.get("/api/clientes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "id inválido" });

    const p = await getPool();
    const result = await p.request().input("id", sql.Int, id).query(`
        SELECT id_cliente, razon_social, cuit, domicilio, tipo_iva
        FROM Clientes
        WHERE id_cliente = @id
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(result.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// POST /api/clientes
app.post("/api/clientes", async (req, res) => {
  try {
    const errors = validateCliente(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { razon_social, cuit, domicilio, tipo_iva } = req.body;

    const p = await getPool();
    const result = await p
      .request()
      .input("razon_social", sql.NVarChar(200), String(razon_social).trim())
      .input("cuit", sql.NVarChar(20), String(cuit).trim())
      .input("domicilio", sql.NVarChar(250), String(domicilio).trim())
      .input("tipo_iva", sql.NVarChar(50), String(tipo_iva).trim()).query(`
        INSERT INTO Clientes (razon_social, cuit, domicilio, tipo_iva)
        OUTPUT INSERTED.id_cliente
        VALUES (@razon_social, @cuit, @domicilio, @tipo_iva)
      `);

    res.status(201).json({
      id_cliente: result.recordset[0].id_cliente,
      razon_social: String(razon_social).trim(),
      cuit: String(cuit).trim(),
      domicilio: String(domicilio).trim(),
      tipo_iva: String(tipo_iva).trim(),
    });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// PUT /api/clientes/:id
app.put("/api/clientes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "id inválido" });

    const errors = validateCliente(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { razon_social, cuit, domicilio, tipo_iva } = req.body;

    const p = await getPool();
    const result = await p
      .request()
      .input("id", sql.Int, id)
      .input("razon_social", sql.NVarChar(200), String(razon_social).trim())
      .input("cuit", sql.NVarChar(20), String(cuit).trim())
      .input("domicilio", sql.NVarChar(250), String(domicilio).trim())
      .input("tipo_iva", sql.NVarChar(50), String(tipo_iva).trim()).query(`
        UPDATE Clientes
        SET razon_social = @razon_social,
            cuit = @cuit,
            domicilio = @domicilio,
            tipo_iva = @tipo_iva
        WHERE id_cliente = @id;

        SELECT @@ROWCOUNT AS affected;
      `);

    if ((result.recordset[0]?.affected ?? 0) === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({
      id_cliente: id,
      razon_social: String(razon_social).trim(),
      cuit: String(cuit).trim(),
      domicilio: String(domicilio).trim(),
      tipo_iva: String(tipo_iva).trim(),
    });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// DELETE /api/clientes/:id
app.delete("/api/clientes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "id inválido" });

    const p = await getPool();
    const result = await p.request().input("id", sql.Int, id).query(`
        DELETE FROM Clientes WHERE id_cliente = @id;
        SELECT @@ROWCOUNT AS affected;
      `);

    if ((result.recordset[0]?.affected ?? 0) === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.get("/dbinfo", async (req, res) => {
  try {
    const p = await getPool();
    const r = await p.request().query(`
      SELECT
        @@SERVERNAME AS server_name,
        DB_NAME() AS database_name,
        SYSTEM_USER AS system_user,
        SUSER_SNAME() AS login_name
    `);
    res.json({ ok: true, ...r.recordset[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

// 6) Start
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
