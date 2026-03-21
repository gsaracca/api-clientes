const request = require('supertest');

// Mock the db module before loading the app
jest.mock('../db', () => {
  // helper to create a mock request object
  function makeRequest(responseProvider) {
    const inputs = {};
    return () => {
      const req = {
        input: (name, type, value) => { inputs[name] = value; return req; },
        query: async (q) => responseProvider(q, inputs),
      };
      return req;
    };
  }

  // default provider
  const provider = async (q, inputs) => {
    if (q && q.includes('SELECT 1 AS ok')) return { recordset: [{ ok: 1 }] };
    if (q && q.includes('FROM Clientes') && q.includes('WHERE') && q.includes('id_cliente')) {
      // simulate not found
      return { recordset: [] };
    }
    if (q && q.includes('FROM Clientes')) {
      return { recordset: [
        { id_cliente: 1, razon_social: 'ACME', cuit: '20123456789', domicilio: 'Calle Falsa 123', tipo_iva: 'Responsable Inscripto' }
      ] };
    }
    if (q && q.includes('INSERT INTO Clientes')) {
      return { recordset: [{ id_cliente: 123 }] };
    }
    return { recordset: [] };
  };

  return {
    getPool: async () => ({ request: makeRequest(provider) }),
    sql: {
      NVarChar: jest.fn(),
      Int: jest.fn()
    }
  };
});

const app = require('../server');

describe('API básica', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('db');
  });

  test('GET /api/clientes', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/clientes/:id 404', async () => {
    const res = await request(app).get('/api/clientes/9999');
    expect(res.status).toBe(404);
  });

  test('POST /api/clientes validation error', async () => {
    const res = await request(app).post('/api/clientes').send({ razon_social: '', cuit: '123', domicilio: '', tipo_iva: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('POST /api/clientes success', async () => {
    const payload = { razon_social: 'Nuevo', cuit: '20123456789', domicilio: 'Direccion', tipo_iva: 'Monotributo' };
    const res = await request(app).post('/api/clientes').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id_cliente');
  });
});
