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

// Función para verificar si un estilo existe y obtener su ID
async function getEstiloId(client, nombreEstilo) {
  const result = await client.query(
    'SELECT id FROM estilos WHERE nombre = $1',
    [nombreEstilo]
  );
  
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  // Si el estilo no existe, devolver 'Casual' como valor predeterminado
  const defaultResult = await client.query(
    'SELECT id FROM estilos WHERE nombre = $1',
    ['Casual']
  );
  
  if (defaultResult.rows.length > 0) {
    return defaultResult.rows[0].id;
  }
  
  // Si ni siquiera existe 'Casual', devolver el primer estilo disponible
  const anyResult = await client.query(
    'SELECT id FROM estilos LIMIT 1'
  );
  
  if (anyResult.rows.length > 0) {
    return anyResult.rows[0].id;
  }
  
  // Si no hay estilos, esto es un error grave en la configuración
  throw new Error('No se encontraron estilos en la base de datos');
}

export async function POST(request) {
  const client = await pool.connect();
  
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
    await client.query('BEGIN');
    
    try {
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
      
      if (data.tipo_usuario === 'marca' || !data.tipo_usuario) {
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
        
        // Asignar estilos a la marca
        if (data.estilosMarca && Array.isArray(data.estilosMarca) && data.estilosMarca.length > 0) {
          for (const nombreEstilo of data.estilosMarca) {
            // Obtener el ID del estilo verificando primero que exista
            const estiloId = await getEstiloId(client, nombreEstilo);
            
            // Insertar la relación marca-estilo
            await client.query(
              `INSERT INTO marcas_estilos (id_marca, id_estilo) 
               VALUES ($1, $2)`,
              [marcaId, estiloId]
            );
          }
        } else {
          // Asignar al menos un estilo por defecto (Casual)
          const defaultEstiloId = await getEstiloId(client, 'Casual');
          
          await client.query(
            `INSERT INTO marcas_estilos (id_marca, id_estilo) 
             VALUES ($1, $2)`,
            [marcaId, defaultEstiloId]
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
        
        // Obtener id de la ciudad de forma segura
        let ciudadId;
        try {
          const ciudadResult = await client.query(
            'SELECT id FROM ciudades WHERE nombre = $1',
            [data.ciudad || 'Madrid']
          );
          
          if (ciudadResult.rows.length > 0) {
            ciudadId = ciudadResult.rows[0].id;
          } else {
            // Si la ciudad no existe, buscar cualquier ciudad
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
        } catch (error) {
          throw new Error(`Error al obtener/crear ciudad: ${error.message}`);
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
        
        // Asignar estilos al showroom
        if (data.estilosShowroom && Array.isArray(data.estilosShowroom) && data.estilosShowroom.length > 0) {
          for (const nombreEstilo of data.estilosShowroom) {
            // Obtener el ID del estilo verificando primero que exista
            const estiloId = await getEstiloId(client, nombreEstilo);
            
            // Insertar la relación showroom-estilo
            await client.query(
              `INSERT INTO showrooms_estilos (id_showroom, id_estilo) 
               VALUES ($1, $2)`,
              [showroomId, estiloId]
            );
          }
        } else {
          // Asignar al menos un estilo por defecto (Casual)
          const defaultEstiloId = await getEstiloId(client, 'Casual');
          
          await client.query(
            `INSERT INTO showrooms_estilos (id_showroom, id_estilo) 
             VALUES ($1, $2)`,
            [showroomId, defaultEstiloId]
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
      throw error; // Re-lanzar para que lo capture el try/catch externo
    }
    
  } catch (error) {
    console.error('Error en el registro:', error);
    
    return NextResponse.json(
      { success: false, message: 'Error al registrar usuario: ' + error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}