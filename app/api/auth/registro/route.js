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

// Función para validar email con una expresión regular más estricta
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Función para validar contraseña con requisitos de seguridad
function validatePassword(password) {
  // Debe tener al menos 8 caracteres
  if (password.length < 8) {
    return {
      valid: false,
      message: 'La contraseña debe tener al menos 8 caracteres'
    };
  }
  
  // Debe contener al menos un número
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: 'La contraseña debe contener al menos un número'
    };
  }
  
  // Debe contener al menos un carácter especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: 'La contraseña debe contener al menos un carácter especial'
    };
  }
  
  // Debe contener al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'La contraseña debe contener al menos una letra mayúscula'
    };
  }
  
  return { valid: true };
}

// Función para sanitizar texto básico
function sanitizeText(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/[<>]/g, '') // Elimina caracteres HTML básicos
    .slice(0, 255);       // Limita la longitud
}

// Función para validar nombre/apellido
function validateName(name) {
  if (!name || name.trim().length < 2) {
    return {
      valid: false,
      message: 'El nombre debe tener al menos 2 caracteres'
    };
  }
  
  // Solo permite letras, espacios y algunos caracteres especiales para nombres compuestos
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(name)) {
    return {
      valid: false,
      message: 'El nombre contiene caracteres no permitidos'
    };
  }
  
  return { valid: true };
}

export async function POST(request) {
  try {
    // Obtener datos del formulario
    const data = await request.json();
    
    // VALIDACIONES MEJORADAS
    
    // 1. Validar campos obligatorios
    const requiredFields = ['email', 'password', 'nombre', 'apellido', 'tipo_usuario'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `El campo ${field} es obligatorio` },
          { status: 400 }
        );
      }
    }
    
    // 2. Validar formato de email
    if (!validateEmail(data.email)) {
      return NextResponse.json(
        { success: false, message: 'El formato de email es inválido' },
        { status: 400 }
      );
    }
    
    // 3. Validar seguridad de contraseña
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      );
    }
    
    // 4. Validar nombre y apellido
    const nombreValidation = validateName(data.nombre);
    if (!nombreValidation.valid) {
      return NextResponse.json(
        { success: false, message: nombreValidation.message },
        { status: 400 }
      );
    }
    
    const apellidoValidation = validateName(data.apellido);
    if (!apellidoValidation.valid) {
      return NextResponse.json(
        { success: false, message: apellidoValidation.message },
        { status: 400 }
      );
    }
    
    // 5. Validar tipo de usuario
    if (!['marca', 'showroom'].includes(data.tipo_usuario)) {
      return NextResponse.json(
        { success: false, message: 'Tipo de usuario inválido' },
        { status: 400 }
      );
    }
    
    // 6. Validaciones específicas según tipo de usuario
    if (data.tipo_usuario === 'marca') {
      if (!data.nombreMarca) {
        return NextResponse.json(
          { success: false, message: 'El nombre de la marca es obligatorio' },
          { status: 400 }
        );
      }
      
      // Validar año de fundación (si se proporciona)
      if (data.anioFundacion) {
        const year = parseInt(data.anioFundacion);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1800 || year > currentYear) {
          return NextResponse.json(
            { success: false, message: 'Año de fundación inválido' },
            { status: 400 }
          );
        }
      }
    } else {
      // Validaciones para showroom
      if (!data.nombreShowroom) {
        return NextResponse.json(
          { success: false, message: 'El nombre del showroom es obligatorio' },
          { status: 400 }
        );
      }
      
      if (!data.direccion) {
        return NextResponse.json(
          { success: false, message: 'La dirección es obligatoria' },
          { status: 400 }
        );
      }
      
      if (!data.ciudad) {
        return NextResponse.json(
          { success: false, message: 'La ciudad es obligatoria' },
          { status: 400 }
        );
      }
      
      // Validar capacidad (si se proporciona)
      if (data.capacidadMarcas) {
        const capacidad = parseInt(data.capacidadMarcas);
        if (isNaN(capacidad) || capacidad <= 0 || capacidad > 100) {
          return NextResponse.json(
            { success: false, message: 'Capacidad de marcas inválida (debe ser entre 1 y 100)' },
            { status: 400 }
          );
        }
      }
    }
    
    // Verificar si el correo ya existe
    const emailCheck = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [data.email]
    );
    
    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Este correo electrónico ya está registrado' },
        { status: 400 }
      );
    }
    
    // Sanitizar datos antes de procesarlos
    const sanitizedData = {
      ...data,
      nombre: sanitizeText(data.nombre),
      apellido: sanitizeText(data.apellido),
      email: data.email.toLowerCase().trim(),
      nombreMarca: data.tipo_usuario === 'marca' ? sanitizeText(data.nombreMarca) : null,
      nombreShowroom: data.tipo_usuario === 'showroom' ? sanitizeText(data.nombreShowroom) : null,
      descripcionMarca: data.tipo_usuario === 'marca' ? sanitizeText(data.descripcionMarca) : null,
      descripcionShowroom: data.tipo_usuario === 'showroom' ? sanitizeText(data.descripcionShowroom) : null,
      direccion: data.tipo_usuario === 'showroom' ? sanitizeText(data.direccion) : null,
    };
    
    // Iniciar una transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Crear el usuario
      const hashedPassword = await bcrypt.hash(data.password, 12); // Aumentado a 12 rondas
      const userId = uuidv4();
      
      await client.query(
        `INSERT INTO usuarios (
          id, email, password_hash, nombre, apellido, tipo_usuario, 
          fecha_registro, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, 'activo')`,
        [
          userId,
          sanitizedData.email,
          hashedPassword,
          sanitizedData.nombre,
          sanitizedData.apellido,
          sanitizedData.tipo_usuario
        ]
      );
      
      // 2. Crear el equipo
      const equipoId = uuidv4();
      let equipoNombre = sanitizedData.tipo_usuario === 'marca' 
        ? sanitizedData.nombreMarca 
        : sanitizedData.nombreShowroom;
      
      await client.query(
        `INSERT INTO equipos (
          id, nombre, tipo_equipo, fecha_creacion, id_usuario_creador
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)`,
        [
          equipoId,
          equipoNombre,
          sanitizedData.tipo_usuario,
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
      if (sanitizedData.tipo_usuario === 'marca') {
        // Crear marca
        const marcaId = uuidv4();
        const slug = generateSlug(sanitizedData.nombreMarca);
        
        await client.query(
          `INSERT INTO marcas (
            id, id_equipo, nombre, slug, descripcion, anio_fundacion,
            fecha_creacion
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
          [
            marcaId,
            equipoId,
            sanitizedData.nombreMarca,
            slug,
            sanitizedData.descripcionMarca || null,
            sanitizedData.anioFundacion ? parseInt(sanitizedData.anioFundacion) : null
          ]
        );
        
        // Asignar estilos a la marca
        if (data.estilosMarca && Array.isArray(data.estilosMarca) && data.estilosMarca.length > 0) {
          for (const estiloId of data.estilosMarca) {
            await client.query(
              `INSERT INTO marcas_estilos (id_marca, id_estilo) 
               VALUES ($1, (SELECT id FROM estilos WHERE nombre = $2))`,
              [marcaId, estiloId]
            );
          }
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
        const slug = generateSlug(sanitizedData.nombreShowroom);
        
        // Obtener id de la ciudad
        let ciudadId;
        const ciudadResult = await client.query(
          'SELECT id FROM ciudades WHERE nombre = $1',
          [sanitizedData.ciudad]
        );
        
        if (ciudadResult.rows.length > 0) {
          ciudadId = ciudadResult.rows[0].id;
        } else {
          // Si la ciudad no existe, crearla
          ciudadId = uuidv4();
          await client.query(
            `INSERT INTO ciudades (id, nombre, pais) 
             VALUES ($1, $2, 'España')`,
            [ciudadId, sanitizedData.ciudad]
          );
        }
        
        await client.query(
          `INSERT INTO showrooms (
            id, id_equipo, nombre, slug, descripcion, id_ciudad,
            direccion, capacidad_marcas, fecha_creacion
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
          [
            showroomId,
            equipoId,
            sanitizedData.nombreShowroom,
            slug,
            sanitizedData.descripcionShowroom || null,
            ciudadId,
            sanitizedData.direccion,
            sanitizedData.capacidadMarcas ? parseInt(sanitizedData.capacidadMarcas) : null
          ]
        );
        
        // Asignar estilos al showroom
        if (data.estilosShowroom && Array.isArray(data.estilosShowroom) && data.estilosShowroom.length > 0) {
          for (const estiloId of data.estilosShowroom) {
            await client.query(
              `INSERT INTO showrooms_estilos (id_showroom, id_estilo) 
               VALUES ($1, (SELECT id FROM estilos WHERE nombre = $2))`,
              [showroomId, estiloId]
            );
          }
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
      
      // Mensajes de error más detallados para problemas comunes
      if (error.code === '23505') { // Violación de restricción única
        return NextResponse.json(
          { success: false, message: 'Ya existe un registro con estos datos' },
          { status: 400 }
        );
      } else if (error.code === '23503') { // Violación de clave foránea
        return NextResponse.json(
          { success: false, message: 'Datos de referencia inválidos' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: 'Error al registrar usuario. Por favor, intente de nuevo más tarde.' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error general:', error);
    
    return NextResponse.json(
      { success: false, message: 'Error del servidor. Por favor, intente de nuevo más tarde.' },
      { status: 500 }
    );
  }
}