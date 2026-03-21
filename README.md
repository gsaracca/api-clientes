# api-clientes

App simple CRUD para clientes.

## Ejecutar la app

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo `clientes.env` con las variables de conexión a la base de datos (ejemplo):

```
DB_SERVER=LENOVO\\SQLEXPRESS
DB_NAME=MiBase
DB_USER=usuario
DB_PASSWORD=secreto
PORT=3000
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

La aplicación servirá `public/index.html` en `http://localhost:3000`.

## Tests automáticos

Se usan `jest` y `supertest`. Los tests isolan la dependencia de la base de datos mediante un mock de `./db`.

Instala las dependencias (si no lo hiciste):

```bash
npm install
```

Ejecuta los tests:

```bash
npm test
```

## Cambios realizados

- Se agregó autocompletado para `Tipo IVA` (input + datalist) en `public/index.html`.
- Se añadió máscara visual para el campo `CUIT` y se normaliza el valor al enviar (solo dígitos).
- La exportación a Excel/CSV ahora incluye todos los registros cargados.
- Se refactorizó la extracción de la conexión DB a `db.js` para facilitar testeo.
- Se agregaron tests básicos en `__tests__/api.test.js`.

Si quieres que los tests ejecuten contra una base real en lugar del mock, puedo añadir configuración para ello (variables de entorno y/o un archivo de configuración de test).
