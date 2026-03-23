# API Clientes

REST API para gestión de clientes, desarrollada con **Node.js** y **Express**, conectada a **SQL Server** mediante el driver nativo `msnodesqlv8`. Incluye un frontend HTML estático servido desde la misma aplicación y una suite de tests automatizados con Jest.

---

## Tabla de contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Endpoints](#endpoints)
- [Validaciones](#validaciones)
- [Frontend](#frontend)
- [Tests](#tests)
- [Estructura del proyecto](#estructura-del-proyecto)

---

## Requisitos

- **Node.js** v18 o superior
- **SQL Server** (local o remoto)
- Driver nativo de SQL Server para Node: `msnodesqlv8` (requiere compilación nativa; en Windows se instala automáticamente con `npm install`)

---

## Instalación

```bash
git clone <url-del-repositorio>
cd api-clientes
npm install
```

---

## Configuración

Crear un archivo `clientes.env` en la raíz del proyecto con las siguientes variables de entorno:

```env
DB_SERVER=nombre_o_ip_del_servidor
DB_NAME=nombre_de_la_base
DB_USER=usuario_sql
DB_PASSWORD=contraseña_sql
PORT=3000
```

> El archivo `clientes.env` está excluido del repositorio. Nunca lo subas al control de versiones.

### Tabla requerida en SQL Server

La API espera que exista la siguiente tabla en la base de datos configurada:

```sql
CREATE TABLE Clientes (
    id_cliente  INT           IDENTITY(1,1) PRIMARY KEY,
    razon_social NVARCHAR(200) NOT NULL,
    cuit        NVARCHAR(20)  NOT NULL,
    domicilio   NVARCHAR(250) NOT NULL,
    tipo_iva    NVARCHAR(50)  NOT NULL
);
```

---

## Ejecución

### Modo desarrollo (con recarga automática)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

La aplicación queda disponible en `http://localhost:3000` (o el puerto configurado en `PORT`).

---

## Endpoints

### Diagnóstico

| Método | Ruta       | Descripción                                      |
|--------|------------|--------------------------------------------------|
| GET    | `/health`  | Verifica que la app y la base de datos respondan |
| GET    | `/dbinfo`  | Devuelve información del servidor SQL conectado  |

**GET /health — Ejemplo de respuesta exitosa:**
```json
{ "ok": true, "db": 1 }
```

**GET /health — Ejemplo de respuesta con error de DB:**
```json
{ "ok": false, "error": "Failed to connect to ..." }
```

---

### Clientes

| Método | Ruta                  | Descripción                            |
|--------|-----------------------|----------------------------------------|
| GET    | `/api/clientes`       | Lista todos los clientes               |
| GET    | `/api/clientes?q=...` | Busca clientes por texto libre         |
| GET    | `/api/clientes/:id`   | Obtiene un cliente por ID              |
| POST   | `/api/clientes`       | Crea un nuevo cliente                  |
| PUT    | `/api/clientes/:id`   | Actualiza todos los datos de un cliente|
| DELETE | `/api/clientes/:id`   | Elimina un cliente                     |

---

#### GET /api/clientes

Devuelve todos los clientes ordenados alfabéticamente por razón social.

```http
GET /api/clientes
```

**Respuesta 200:**
```json
[
  {
    "id_cliente": 1,
    "razon_social": "ACME S.A.",
    "cuit": "30123456789",
    "domicilio": "Av. Siempreviva 742",
    "tipo_iva": "Responsable Inscripto"
  }
]
```

---

#### GET /api/clientes?q=texto

Busca en los campos `razon_social`, `cuit`, `domicilio` y `tipo_iva`.

```http
GET /api/clientes?q=acme
```

---

#### GET /api/clientes/:id

```http
GET /api/clientes/1
```

**Respuesta 200:**
```json
{
  "id_cliente": 1,
  "razon_social": "ACME S.A.",
  "cuit": "30123456789",
  "domicilio": "Av. Siempreviva 742",
  "tipo_iva": "Responsable Inscripto"
}
```

**Respuesta 404:**
```json
{ "error": "Cliente no encontrado" }
```

---

#### POST /api/clientes

Crea un nuevo cliente. Todos los campos son obligatorios.

```http
POST /api/clientes
Content-Type: application/json

{
  "razon_social": "Mi Empresa S.R.L.",
  "cuit": "20304050607",
  "domicilio": "Calle Falsa 123",
  "tipo_iva": "Monotributo"
}
```

**Respuesta 201:**
```json
{
  "id_cliente": 42,
  "razon_social": "Mi Empresa S.R.L.",
  "cuit": "20304050607",
  "domicilio": "Calle Falsa 123",
  "tipo_iva": "Monotributo"
}
```

---

#### PUT /api/clientes/:id

Reemplaza todos los datos del cliente indicado.

```http
PUT /api/clientes/42
Content-Type: application/json

{
  "razon_social": "Mi Empresa Actualizada S.R.L.",
  "cuit": "20304050607",
  "domicilio": "Nueva Dirección 456",
  "tipo_iva": "Responsable Inscripto"
}
```

**Respuesta 200:** devuelve el objeto actualizado.
**Respuesta 404:** si el ID no existe.

---

#### DELETE /api/clientes/:id

```http
DELETE /api/clientes/42
```

**Respuesta 204:** sin cuerpo (eliminación exitosa).
**Respuesta 404:** si el ID no existe.

---

## Validaciones

Antes de crear o actualizar un cliente, el servidor valida:

- Los campos `razon_social`, `cuit`, `domicilio` y `tipo_iva` son **obligatorios** y no pueden estar vacíos.
- El `cuit` debe tener exactamente **11 dígitos numéricos** (sin guiones ni espacios).

**Respuesta 400 con errores de validación:**
```json
{
  "errors": [
    "Falta campo obligatorio: razon_social",
    "cuit debe tener 11 dígitos numéricos (sin guiones)."
  ]
}
```

---

## Frontend

Al iniciar la app, el frontend estático ubicado en `public/index.html` es accesible en:

```
http://localhost:3000
```

Incluye funcionalidades como:
- Listado y búsqueda de clientes en tiempo real
- Formulario de alta y edición con máscara visual para el CUIT
- Autocompletado para el campo Tipo IVA
- Exportación de la lista a Excel/CSV

---

## Tests

Los tests están escritos con **Jest** y **Supertest**. La capa de base de datos es mockeada, por lo que los tests corren sin necesidad de conexión a SQL Server.

```bash
npm test
```

Los tests cubren:

| Test | Descripción |
|------|-------------|
| `GET /health` | Verifica respuesta 200 con `ok: true` |
| `GET /api/clientes` | Verifica que devuelve un array con resultados |
| `GET /api/clientes/:id` (404) | Verifica respuesta 404 para ID inexistente |
| `POST /api/clientes` (validación) | Verifica rechazo con datos inválidos |
| `POST /api/clientes` (éxito) | Verifica creación exitosa con `id_cliente` en respuesta |

Los tests se encuentran en [__tests__/api.test.js](__tests__/api.test.js).

---

## Estructura del proyecto

```
api-clientes/
├── __tests__/
│   └── api.test.js       # Suite de tests con Jest + Supertest
├── public/
│   └── index.html        # Frontend HTML estático
├── db.js                 # Configuración y pool de conexión a SQL Server
├── server.js             # Aplicación Express: rutas y lógica de negocio
├── package.json
└── clientes.env          # Variables de entorno (NO incluido en el repo)
```

---

## Stack tecnológico

| Tecnología | Rol |
|------------|-----|
| Node.js    | Runtime |
| Express 5  | Framework HTTP |
| mssql + msnodesqlv8 | Conexión nativa a SQL Server |
| dotenv     | Gestión de variables de entorno |
| cors       | Habilita CORS en todos los endpoints |
| nodemon    | Recarga automática en desarrollo |
| Jest       | Framework de testing |
| Supertest  | Testing de endpoints HTTP |
