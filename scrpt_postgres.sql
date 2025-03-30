-- Crear la base de datos
CREATE DATABASE plataforma_marcas_showrooms;

-- Conectar a la base de datos
\c plataforma_marcas_showrooms;

-- Crear extensión para UUID y PostGIS para funcionalidades geoespaciales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Crear tipos ENUM
CREATE TYPE tipo_usuario AS ENUM ('marca', 'showroom');
CREATE TYPE estado_usuario AS ENUM ('activo', 'inactivo', 'suspendido');
CREATE TYPE tipo_equipo AS ENUM ('marca', 'showroom');
CREATE TYPE estado_showroom AS ENUM ('disponible', 'ocupado', 'mantenimiento');
CREATE TYPE tipo_imagen AS ENUM ('principal', 'galeria');
CREATE TYPE estado_colaboracion AS ENUM ('propuesta', 'negociacion', 'activa', 'finalizada');

-- Tabla de usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    foto_perfil VARCHAR(255),
    tipo_usuario tipo_usuario NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    estado estado_usuario NOT NULL DEFAULT 'activo',
    google_id VARCHAR(255) UNIQUE,
    metadata JSONB
);

-- Tabla de equipos
CREATE TABLE equipos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_equipo tipo_equipo NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creador UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Insertar roles predefinidos
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Puede editar y ver todo'),
('gestor', 'Gestiona mensajes pero no puede modificar información del perfil');

-- Tabla de permisos
CREATE TABLE permisos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    ambito VARCHAR(100) NOT NULL
);

-- Insertar permisos predefinidos
INSERT INTO permisos (nombre, descripcion, ambito) VALUES
('editar_perfil', 'Permite editar información del perfil', 'perfil'),
('gestionar_mensajes', 'Permite gestionar mensajes', 'comunicacion'),
('ver_estadisticas', 'Permite ver estadísticas', 'analisis'),
('administrar_miembros', 'Permite administrar miembros del equipo', 'equipo'),
('gestionar_colaboraciones', 'Permite gestionar colaboraciones', 'negocio');

-- Tabla de relación entre roles y permisos
CREATE TABLE roles_permisos (
    id_rol UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    id_permiso UUID NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (id_rol, id_permiso)
);

-- Asignar permisos a roles
-- Admin tiene todos los permisos
INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT 
    (SELECT id FROM roles WHERE nombre = 'admin'),
    id
FROM permisos;

-- Gestor solo tiene permiso de gestionar mensajes
INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT 
    (SELECT id FROM roles WHERE nombre = 'gestor'),
    (SELECT id FROM permisos WHERE nombre = 'gestionar_mensajes');

-- Tabla de miembros de equipo
CREATE TABLE miembros_equipo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_equipo UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rol UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_equipo, id_usuario)
);

-- Tabla de estilos
CREATE TABLE estilos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(255)
);

-- Insertar estilos predefinidos
INSERT INTO estilos (nombre, descripcion) VALUES
('Casual', 'Ropa para uso diario, cómoda y versátil'),
('Urbano', 'Estilo inspirado en la cultura y vida urbana'),
('Formal', 'Ropa para ocasiones formales y entornos de negocios'),
('Streetwear', 'Moda callejera con influencias de skate, hip hop y deportes'),
('Sostenible', 'Marcas enfocadas en la sostenibilidad y moda ética'),
('Vintage', 'Prendas de inspiración retro o con estética de otras épocas'),
('Minimalista', 'Diseños simples, funcionales con pocos adornos'),
('Deportivo', 'Ropa deportiva y athleisure');

-- Tabla de ciudades
CREATE TABLE ciudades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    provincia VARCHAR(100),
    pais VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    coordenadas GEOGRAPHY(POINT),
    popular BOOLEAN DEFAULT FALSE,
    UNIQUE (nombre, provincia, pais)
);

-- Tabla de marcas
CREATE TABLE marcas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_equipo UUID NOT NULL REFERENCES equipos(id) ON DELETE RESTRICT,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    descripcion TEXT,
    historia TEXT,
    anio_fundacion INTEGER,
    logo_url VARCHAR(255),
    foto_portada VARCHAR(255),
    sitio_web VARCHAR(255),
    redes_sociales JSONB,
    contacto_principal VARCHAR(255),
    contacto_email VARCHAR(255),
    contacto_telefono VARCHAR(50),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    destacada BOOLEAN DEFAULT FALSE,
    verificada BOOLEAN DEFAULT FALSE,
    metadata JSONB
);

-- Tabla relación marcas y estilos
CREATE TABLE marcas_estilos (
    id_marca UUID NOT NULL REFERENCES marcas(id) ON DELETE CASCADE,
    id_estilo UUID NOT NULL REFERENCES estilos(id) ON DELETE CASCADE,
    PRIMARY KEY (id_marca, id_estilo)
);

-- Tabla de showrooms
CREATE TABLE showrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_equipo UUID NOT NULL REFERENCES equipos(id) ON DELETE RESTRICT,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    descripcion TEXT,
    id_ciudad UUID REFERENCES ciudades(id) ON DELETE RESTRICT,
    direccion TEXT NOT NULL,
    coordenadas GEOGRAPHY(POINT),
    codigo_postal VARCHAR(20),
    tamano_m2 NUMERIC(10,2), -- en metros cuadrados
    capacidad_marcas INTEGER,
    caracteristicas JSONB, -- Array de características
    disponibilidad JSONB, -- Formato calendario
    precio_base DECIMAL(10,2),
    precio_por JSONB, -- Por día, semana, mes, etc.
    estado estado_showroom NOT NULL DEFAULT 'disponible',
    destacado BOOLEAN DEFAULT FALSE,
    verificado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Tabla relación showrooms y estilos ideales
CREATE TABLE showrooms_estilos (
    id_showroom UUID NOT NULL REFERENCES showrooms(id) ON DELETE CASCADE,
    id_estilo UUID NOT NULL REFERENCES estilos(id) ON DELETE CASCADE,
    PRIMARY KEY (id_showroom, id_estilo)
);

-- Tabla de imágenes de showrooms
CREATE TABLE imagenes_showrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_showroom UUID NOT NULL REFERENCES showrooms(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    tipo tipo_imagen NOT NULL DEFAULT 'galeria'
);

-- Tabla de imágenes de marcas
CREATE TABLE imagenes_marcas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_marca UUID NOT NULL REFERENCES marcas(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    tipo tipo_imagen NOT NULL DEFAULT 'galeria'
);

-- Tabla de colaboraciones
CREATE TABLE colaboraciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_marca UUID NOT NULL REFERENCES marcas(id) ON DELETE RESTRICT,
    id_showroom UUID NOT NULL REFERENCES showrooms(id) ON DELETE RESTRICT,
    estado estado_colaboracion NOT NULL DEFAULT 'propuesta',
    fecha_inicio DATE,
    fecha_fin DATE,
    terminos JSONB,
    detalles TEXT,
    notas_internas TEXT,
    creado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(50) NOT NULL, -- 'colaboracion', 'mensaje', 'sistema', etc.
    id_referencia UUID, -- ID opcional al que hace referencia la notificación
    url_accion VARCHAR(255), -- URL opcional para redirigir al hacer clic
    metadata JSONB
);

-- Tabla de valoraciones
CREATE TABLE valoraciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_colaboracion UUID NOT NULL REFERENCES colaboraciones(id) ON DELETE CASCADE,
    id_emisor UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    tipo_emisor tipo_usuario NOT NULL, -- 'marca' o 'showroom'
    puntuacion INTEGER NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    visible BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estadísticas de perfil (para análisis y dashboard)
CREATE TABLE estadisticas_perfil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_referencia UUID NOT NULL, -- ID de marca o showroom
    tipo_referencia tipo_usuario NOT NULL, -- 'marca' o 'showroom'
    visitas INTEGER DEFAULT 0,
    contactos_recibidos INTEGER DEFAULT 0,
    colaboraciones_realizadas INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    datos_por_periodo JSONB, -- Para almacenar datos históricos por días/semanas/meses
    UNIQUE (id_referencia, tipo_referencia)
);

-- Tabla para artículos del blog
CREATE TABLE blog_articulos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    extracto TEXT,
    contenido TEXT NOT NULL,
    imagen_destacada VARCHAR(255),
    id_autor UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_publicacion TIMESTAMP,
    categoria VARCHAR(50) NOT NULL, -- 'Tendencias', 'Consejos', 'Eventos', etc.
    tags JSONB,
    estado VARCHAR(20) DEFAULT 'borrador', -- 'borrador', 'publicado', 'archivado'
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para casos de éxito
CREATE TABLE casos_exito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    testimonio TEXT,
    id_marca UUID REFERENCES marcas(id) ON DELETE CASCADE,
    id_showroom UUID REFERENCES showrooms(id) ON DELETE CASCADE,
    imagen_url VARCHAR(255),
    resultados JSONB, -- Para almacenar métricas de éxito
    destacado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (id_marca IS NOT NULL AND id_showroom IS NULL) OR
        (id_marca IS NULL AND id_showroom IS NOT NULL)
    )
);

-- Tabla para subscriptores al newsletter
CREATE TABLE newsletter_subscriptores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100),
    fecha_subscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    preferencias JSONB
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_google_id ON usuarios(google_id);
CREATE INDEX idx_equipos_tipo ON equipos(tipo_equipo);
CREATE INDEX idx_miembros_equipo_usuario ON miembros_equipo(id_usuario);
CREATE INDEX idx_miembros_equipo_equipo ON miembros_equipo(id_equipo);
CREATE INDEX idx_marcas_nombre ON marcas(nombre);
CREATE INDEX idx_marcas_slug ON marcas(slug);
CREATE INDEX idx_marcas_destacada ON marcas(destacada);
CREATE INDEX idx_showrooms_nombre ON showrooms(nombre);
CREATE INDEX idx_showrooms_slug ON showrooms(slug);
CREATE INDEX idx_showrooms_ciudad ON showrooms(id_ciudad);
CREATE INDEX idx_showrooms_estado ON showrooms(estado);
CREATE INDEX idx_showrooms_destacado ON showrooms(destacado);
CREATE INDEX idx_colaboraciones_marca ON colaboraciones(id_marca);
CREATE INDEX idx_colaboraciones_showroom ON colaboraciones(id_showroom);
CREATE INDEX idx_colaboraciones_estado ON colaboraciones(estado);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_valoraciones_colaboracion ON valoraciones(id_colaboracion);
CREATE INDEX idx_blog_articulos_slug ON blog_articulos(slug);
CREATE INDEX idx_blog_articulos_categoria ON blog_articulos(categoria);
CREATE INDEX idx_blog_articulos_estado ON blog_articulos(estado);

-- Crear índice espacial para búsquedas por ubicación
CREATE INDEX idx_showrooms_coordenadas ON showrooms USING GIST (coordenadas);
CREATE INDEX idx_ciudades_coordenadas ON ciudades USING GIST (coordenadas);

-- Crear función para actualizar timestamp de última actualización
CREATE OR REPLACE FUNCTION update_ultima_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultima_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger para actualizar automáticamente última_actualizacion
CREATE TRIGGER update_colaboraciones_ultima_actualizacion
BEFORE UPDATE ON colaboraciones
FOR EACH ROW
EXECUTE FUNCTION update_ultima_actualizacion();

CREATE TRIGGER update_blog_ultima_actualizacion
BEFORE UPDATE ON blog_articulos
FOR EACH ROW
EXECUTE FUNCTION update_ultima_actualizacion();

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_slug(texto VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    slug VARCHAR;
BEGIN
    -- Convertir a minúsculas y reemplazar espacios por guiones
    slug := lower(texto);
    slug := regexp_replace(slug, '[^a-z0-9\s]', '', 'g');
    slug := regexp_replace(slug, '\s+', '-', 'g');
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Función para búsqueda de showrooms por proximidad
CREATE OR REPLACE FUNCTION buscar_showrooms_por_ubicacion(
    lat FLOAT,
    lng FLOAT,
    radio_km FLOAT,
    id_estilo UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    nombre VARCHAR,
    direccion TEXT,
    distancia_km FLOAT,
    precio_base DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id, 
        s.nombre, 
        s.direccion, 
        ST_Distance(s.coordenadas, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) / 1000 AS distancia_km,
        s.precio_base
    FROM showrooms s
    LEFT JOIN showrooms_estilos se ON s.id = se.id_showroom
    WHERE s.estado = 'disponible'
    AND (id_estilo IS NULL OR se.id_estilo = id_estilo)
    AND ST_DWithin(
        s.coordenadas,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radio_km * 1000
    )
    ORDER BY distancia_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Vistas para homepage

-- Vista para showrooms destacados
CREATE VIEW v_showrooms_destacados AS
SELECT 
    s.id, 
    s.nombre, 
    s.slug,
    s.descripcion,
    c.nombre AS ciudad,
    c.provincia,
    c.pais,
    s.tamano_m2,
    s.capacidad_marcas,
    s.precio_base,
    s.destacado,
    s.verificado,
    (SELECT url FROM imagenes_showrooms 
     WHERE id_showroom = s.id AND tipo = 'principal' 
     ORDER BY orden ASC LIMIT 1) AS imagen_principal,
    (SELECT COUNT(*) FROM colaboraciones 
     WHERE id_showroom = s.id AND estado = 'finalizada') AS total_colaboraciones,
    (SELECT COALESCE(AVG(puntuacion), 0) FROM valoraciones v
     JOIN colaboraciones co ON v.id_colaboracion = co.id
     WHERE co.id_showroom = s.id AND v.tipo_emisor = 'marca') AS puntuacion_media,
    array_agg(DISTINCT e.nombre) AS estilos
FROM 
    showrooms s
JOIN 
    ciudades c ON s.id_ciudad = c.id
LEFT JOIN
    showrooms_estilos se ON s.id = se.id_showroom
LEFT JOIN
    estilos e ON se.id_estilo = e.id
WHERE 
    s.estado = 'disponible'
GROUP BY 
    s.id, c.nombre, c.provincia, c.pais;

-- Vista para marcas destacadas
CREATE VIEW v_marcas_destacadas AS
SELECT 
    m.id, 
    m.nombre, 
    m.slug,
    m.descripcion,
    m.logo_url,
    m.anio_fundacion,
    m.destacada,
    m.verificada,
    (SELECT COUNT(*) FROM colaboraciones 
     WHERE id_marca = m.id AND estado IN ('activa', 'finalizada')) AS total_colaboraciones,
    (SELECT COALESCE(AVG(puntuacion), 0) FROM valoraciones v
     JOIN colaboraciones co ON v.id_colaboracion = co.id
     WHERE co.id_marca = m.id AND v.tipo_emisor = 'showroom') AS puntuacion_media,
    array_agg(DISTINCT e.nombre) AS estilos
FROM 
    marcas m
LEFT JOIN
    marcas_estilos me ON m.id = me.id_marca
LEFT JOIN
    estilos e ON me.id_estilo = e.id
GROUP BY 
    m.id;

-- Vista para estadísticas de la plataforma (para sección de estadísticas)
CREATE VIEW v_estadisticas_plataforma AS
SELECT
    (SELECT COUNT(*) FROM colaboraciones WHERE estado IN ('activa', 'finalizada')) AS conexiones_exitosas,
    (SELECT COALESCE(AVG(ocupacion), 0) FROM 
        (SELECT id_showroom, COUNT(*) * 1.0 / MAX(s.capacidad_marcas) AS ocupacion
         FROM colaboraciones c
         JOIN showrooms s ON c.id_showroom = s.id
         WHERE c.estado = 'activa'
         GROUP BY id_showroom) AS ocupaciones) AS tasa_ocupacion_promedio,
    (SELECT COUNT(DISTINCT id_ciudad) FROM showrooms) AS ciudades_activas,
    (SELECT COALESCE(AVG(puntuacion), 0) FROM valoraciones) AS satisfaccion_media;

-- Vista para blog en homepage
CREATE VIEW v_blog_reciente AS
SELECT
    id,
    titulo,
    slug,
    extracto,
    imagen_destacada,
    categoria,
    fecha_publicacion,
    (SELECT CONCAT(nombre, ' ', apellido) FROM usuarios WHERE id = id_autor) AS autor
FROM
    blog_articulos
WHERE
    estado = 'publicado'
    AND fecha_publicacion <= CURRENT_TIMESTAMP
ORDER BY
    fecha_publicacion DESC
LIMIT 3;

-- Vista para casos de éxito en homepage
CREATE VIEW v_casos_exito_destacados AS
SELECT
    ce.id,
    ce.titulo,
    ce.descripcion,
    ce.testimonio,
    ce.imagen_url,
    ce.resultados,
    CASE
        WHEN ce.id_marca IS NOT NULL THEN m.nombre
        ELSE s.nombre
    END AS nombre_entidad,
    CASE
        WHEN ce.id_marca IS NOT NULL THEN 'marca'
        ELSE 'showroom'
    END AS tipo_entidad,
    CASE
        WHEN ce.id_marca IS NOT NULL THEN m.logo_url
        ELSE NULL
    END AS logo_url
FROM
    casos_exito ce
LEFT JOIN
    marcas m ON ce.id_marca = m.id
LEFT JOIN
    showrooms s ON ce.id_showroom = s.id
WHERE
    ce.destacado = TRUE
ORDER BY
    ce.fecha_creacion DESC
LIMIT 3;

