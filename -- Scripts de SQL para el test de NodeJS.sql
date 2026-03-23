-- Scripts de SQL para el test de Node.Js

use nodejs

CREATE TABLE Clientes (
    id_cliente INT IDENTITY(1,1) NOT NULL,
    razon_social NVARCHAR(200) NOT NULL,
    cuit NVARCHAR(20) NOT NULL,
    domicilio NVARCHAR(250) NOT NULL,
    tipo_iva NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_Clientes PRIMARY KEY (id_cliente)
);
CREATE UNIQUE INDEX UX_Clientes_CUIT
ON Clientes (cuit);

select * from clientes

INSERT INTO Clientes (razon_social, cuit, domicilio, tipo_iva) VALUES
('Comercial Andina SA',        '30-70984512-3', 'Av. Corrientes 1234, CABA',                 'Responsable Inscripto'),
('Servicios del Sur SRL',      '30-71543210-9', 'Av. Belgrano 845, CABA',                    'Responsable Inscripto'),
('Distribuidora Pampeana SA',  '30-69874563-2', 'Ruta 5 Km 132, La Pampa',                   'Responsable Inscripto'),
('Juan Perez',                 '20-25478963-4', 'Mitre 455, Rosario, Santa Fe',              'Monotributo'),
('Maria Gomez',                '27-28456321-8', 'San Martín 1020, Córdoba',                  'Monotributo'),
('Tecnologia Delta SA',        '30-71234567-1', 'Av. Alem 950, Bahía Blanca',                'Responsable Inscripto'),
('Logistica Federal SRL',      '30-72345678-6', 'Parque Industrial Norte, Pilar',            'Responsable Inscripto'),
('Insumos Médicos Platense',   '30-73456789-4', 'Calle 12 Nº 345, La Plata',                 'Responsable Inscripto'),
('Carlos Rodriguez',           '20-19874563-9', 'Sarmiento 150, San Miguel de Tucumán',      'Consumidor Final'),
('Ana Martinez',               '27-31654789-2', 'Rivadavia 789, Mendoza',                    'Monotributo'),
('Agroexport SA',              '30-74561234-8', 'Ruta 9 Km 273, San Nicolás',                'Responsable Inscripto'),
('Metalúrgica Oeste SRL',      '30-75678901-5', 'Av. Gaona 4200, Morón',                     'Responsable Inscripto'),
('Pedro López',                '20-14523698-7', 'Italia 333, Mar del Plata',                 'Consumidor Final'),
('Estudio Contable Rivera',    '30-76789012-3', 'Av. Santa Fe 2150, CABA',                  'Responsable Inscripto'),
('Sofía Benítez',              '27-29546871-0', 'Belgrano 980, Salta',                       'Monotributo'),
('Construcciones Andinas',     '30-77890123-9', 'Av. España 120, San Juan',                  'Responsable Inscripto'),
('Farmacia Central SRL',       '30-78901234-6', 'Av. San Martín 455, Neuquén',               'Responsable Inscripto'),
('Luciano Torres',             '20-33456789-1', 'Alberdi 77, Río Cuarto',                    'Consumidor Final'),
('Servicios Informáticos AR',  '30-79012345-4', 'Av. Callao 640, CABA',                     'Responsable Inscripto'),
('María López',                '27-24321654-9', '9 de Julio 111, Resistencia',               'Monotributo'),
('Transportes del Norte SA',   '30-80123456-2', 'Ruta 34 Km 1200, Jujuy',                    'Responsable Inscripto'),
('Oscar Fernández',            '20-28745123-6', 'Moreno 875, San Luis',                     'Consumidor Final'),
('Electro Hogar SRL',          '30-81234567-0', 'Av. Mitre 1550, Avellaneda',                'Responsable Inscripto'),
('Paula Giménez',              '27-31874569-5', 'España 320, Posadas',                      'Monotributo'),
('Alimentos del Litoral',      '30-82345678-8', 'Bv. Oroño 2100, Rosario',                  'Responsable Inscripto'),
('Ricardo Suárez',             '20-20456789-3', 'Av. Perón 980, San Martín',                'Consumidor Final'),
('Textil Córdoba SA',          '30-83456789-5', 'Ruta 20 Km 7, Córdoba',                    'Responsable Inscripto'),
('Laura Díaz',                 '27-33456987-1', 'Urquiza 640, Paraná',                     'Monotributo'),
('Servicios Petroleros SRL',   '30-84567890-3', 'Parque Industrial, Comodoro Rivadavia',     'Responsable Inscripto'),
('Héctor Molina',              '20-25698741-9', 'Saavedra 410, Tandil',                    'Consumidor Final'),
('Grupo Financiero Sur',       '30-85678901-1', 'Av. Libertador 5500, CABA',               'Responsable Inscripto'),
('Verónica Acosta',            '27-30124568-4', 'Colón 345, Rafaela',                     'Monotributo'),
('Industrias Patagónicas',     '30-86789012-9', 'Zona Franca, Río Gallegos',               'Responsable Inscripto'),
('Daniel Ríos',                '20-16548932-8', 'Av. Roca 120, General Roca',              'Consumidor Final'),
('Soluciones Energéticas SA',  '30-87890123-7', 'Av. Mosconi 2300, Campana',              'Responsable Inscripto'),
('Natalia Romero',             '27-27894563-6', 'Lavalle 670, Catamarca',                 'Monotributo'),
('Editorial del Centro',       '30-88901234-4', 'Ayacucho 920, CABA',                    'Responsable Inscripto'),
('Miguel Álvarez',             '20-31456987-0', 'Brown 55, Quilmes',                     'Consumidor Final'),
('Comercio Global SRL',        '30-89012345-2', 'Av. Córdoba 1340, CABA',                'Responsable Inscripto'),
('Romina Castillo',            '27-34567891-5', 'Tucumán 880, Santiago del Estero',       'Monotributo'),
('Servicios Portuarios SA',    '30-90123456-0', 'Puerto Nuevo, Dock Sud',               'Responsable Inscripto'),
('Jorge Herrera',              '20-19856324-7', 'Balcarce 210, Luján',                   'Consumidor Final'),
('BioTech Argentina SA',       '30-91234567-8', 'Av. Figueroa Alcorta 3200, CABA',        'Responsable Inscripto'),
('Claudia Moreno',             '27-25698741-3', 'San Lorenzo 140, Goya',                'Monotributo'),
('Importadora Atlántica',      '30-92345678-6', 'Av. Costanera 100, Puerto Madryn',      'Responsable Inscripto'),
('Fernando Ponce',             '20-34521698-2', 'Maipú 730, Junín',                     'Consumidor Final');

