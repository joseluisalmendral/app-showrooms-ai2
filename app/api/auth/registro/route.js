import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Configurar conexión a PostgreSQL
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'your_password',
  database: process.env.POSTGRES_DATABASE || 'plataforma_marcas_showrooms',
  max: 20,
  idleTimeoutMillis: 30000,
});

// Función para generar un slug a partir de un texto
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export async function POST(request) {
  try {
    // Obtener datos del formulario
    const data = await request.json();
    
    // Verificación básica (menos estricta)
    if (!data.email) {
      return NextResponse.json(
        { success: false, message: 'El correo electrónico es obligatorio' },
        { status: 400 }
      );
    }
    
    // Iniciar una transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Crear el usuario
      const hashedPassword = await bcrypt.hash(data.password || '12345678', 10);
      const userId = uuidv4();
      
      await client.query(
        `INSERT INTO usuarios (
          id, email, password_hash, nombre, apellido, tipo_usuario, 
          fecha_registro, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, 'activo')`,
        [
          userId,
          data.email,
          hashedPassword,
          data.nombre || 'Usuario',
          data.apellido || 'Nuevo',
          data.tipo_usuario || 'marca'
        ]
      );
      
      // 2. Crear el equipo
      const equipoId = uuidv4();
      let equipoNombre = '';
      
      if (data.tipo_usuario === 'marca') {
        equipoNombre = data.nombreMarca || 'Nueva Marca';
      } else {
        equipoNombre = data.nombreShowroom || 'Nuevo Showroom';
      }
      
      await client.query(
        `INSERT INTO equipos (
          id, nombre, tipo_equipo, fecha_creacion, id_usuario_creador
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)`,
        [
          equipoId,
          equipoNombre,
          data.tipo_usuario || 'marca',
          userId
        ]
      );
      
      // 3. Asignar al usuario como miembro del equipo con rol admin
      await client.query(
        `INSERT INTO miembros_equipo (
          id, id_equipo, id_usuario, rol, fecha_asignacion
        ) VALUES ($1, $2, $3, (SELECT id FROM roles WHERE nombre = 'admin'), CURRENT_TIMESTAMP)`,
        [
          uuidv4(),
          equipoId,
          userId
        ]
      );
      
      // 4. Crear entidad específica (marca o showroom)
      if (data.tipo_usuario === 'marca' || !data.tipo_usuario) {
        // Crear marca
        const marcaId = uuidv4();
        const nombreMarca = data.nombreMarca || 'Nueva Marca';
        const slug = generateSlug(nombreMarca);
        
        await client.query(
          `INSERT INTO marcas (
            id, id_equipo, nombre, slug, descripcion, anio_fundacion,
            fecha_creacion
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
          [
            marcaId,
            equipoId,
            nombreMarca,
            slug,
            data.descripcionMarca || null,
            data.anioFundacion || null
          ]
        );
        
        // Asignar estilos a la marca (si existen)
        if (data.estilosMarca && Array.isArray(data.estilosMarca) && data.estilosMarca.length > 0) {
          for (const estiloId of data.estilosMarca) {
            try {
              await client.query(
                `INSERT INTO marcas_estilos (id_marca, id_estilo) 
                 VALUES ($1, (SELECT id FROM estilos WHERE nombre = $2))`,
                [marcaId, estiloId]
              );
            } catch (error) {
              console.log(`Error al asignar estilo ${estiloId} a marca: ${error.message}`);
              // Continuamos aunque haya error en estilos
            }
          }
        } else {
          // Asignar al menos un estilo por defecto
          await client.query(
            `INSERT INTO marcas_estilos (id_marca, id_estilo) 
             VALUES ($1, (SELECT id FROM estilos WHERE nombre = 'Casual'))`,
            [marcaId]
          );
        }
        
        // Crear estadísticas iniciales
        await client.query(
          `INSERT INTO estadisticas_perfil (
            id, id_referencia, tipo_referencia, visitas, contactos_recibidos,
            colaboraciones_realizadas, ultima_actualizacion
          ) VALUES ($1, $2, 'marca', 0, 0, 0, CURRENT_TIMESTAMP)`,
          [uuidv4(), marcaId]
        );
        
      } else {
        // Crear showroom
        const showroomId = uuidv4();
        const nombreShowroom = data.nombreShowroom || 'Nuevo Showroom';
        const slug = generateSlug(nombreShowroom);
        
        // Obtener id de la ciudad
        let ciudadId;
        const ciudadResult = await client.query(
          'SELECT id FROM ciudades WHERE nombre = $1',
          [data.ciudad || 'Madrid']
        );
        
        if (ciudadResult.rows.length > 0) {
          ciudadId = ciudadResult.rows[0].id;
        } else {
          // Si la ciudad no existe, usar una ciudad por defecto
          const ciudadDefaultResult = await client.query(
            'SELECT id FROM ciudades LIMIT 1'
          );
          
          if (ciudadDefaultResult.rows.length > 0) {
            ciudadId = ciudadDefaultResult.rows[0].id;
          } else {
            // Si no hay ciudades, crear una
            ciudadId = uuidv4();
            await client.query(
              `INSERT INTO ciudades (id, nombre, pais) 
               VALUES ($1, $2, 'España')`,
              [ciudadId, data.ciudad || 'Madrid']
            );
          }
        }
        
        await client.query(
          `INSERT INTO showrooms (
            id, id_equipo, nombre, slug, descripcion, id_ciudad,
            direccion, capacidad_marcas, fecha_creacion
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
          [
            showroomId,
            equipoId,
            nombreShowroom,
            slug,
            data.descripcionShowroom || null,
            ciudadId,
            data.direccion || 'Dirección por defecto',
            data.capacidadMarcas || 5
          ]
        );
        
        // Asignar estilos al showroom (si existen)
        if (data.estilosShowroom && Array.isArray(data.estilosShowroom) && data.estilosShowroom.length > 0) {
          for (const estiloId of data.estilosShowroom) {
            try {
              await client.query(
                `INSERT INTO showrooms_estilos (id_showroom, id_estilo) 
                 VALUES ($1, (SELECT id FROM estilos WHERE nombre = $2))`,
                [showroomId, estiloId]
              );
            } catch (error) {
              console.log(`Error al asignar estilo ${estiloId} a showroom: ${error.message}`);
              // Continuamos aunque haya error en estilos
            }
          }
        } else {
          // Asignar al menos un estilo por defecto
          await client.query(
            `INSERT INTO showrooms_estilos (id_showroom, id_estilo) 
             VALUES ($1, (SELECT id FROM estilos WHERE nombre = 'Casual'))`,
            [showroomId]
          );
        }
        
        // Crear estadísticas iniciales
        await client.query(
          `INSERT INTO estadisticas_perfil (
            id, id_referencia, tipo_referencia, visitas, contactos_recibidos,
            colaboraciones_realizadas, ultima_actualizacion
          ) VALUES ($1, $2, 'showroom', 0, 0, 0, CURRENT_TIMESTAMP)`,
          [uuidv4(), showroomId]
        );
      }
      
      await client.query('COMMIT');
      
      return NextResponse.json(
        { success: true, message: 'Usuario registrado correctamente' },
        { status: 201 }
      );
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en la transacción:', error);
      
      return NextResponse.json(
        { success: false, message: 'Error al registrar usuario: ' + error.message },
        { status: 500 }
      );
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error general:', error);
    
    return NextResponse.json(
      { success: false, message: 'Error del servidor: ' + error.message },
      { status: 500 }
    );
  }
}