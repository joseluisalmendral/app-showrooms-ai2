import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// Importación corregida del adaptador PostgreSQL
import { PostgresAdapter } from '@auth/pg-adapter';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'your_password',
  database: process.env.POSTGRES_DATABASE || 'plataforma_marcas_showrooms',
  max: 20,
  idleTimeoutMillis: 30000,
});

/**
 * Verificar credenciales de usuario
 */
async function verifyCredentials(credentials) {
  try {
    const { email, password } = credentials;
    
    // Buscar el usuario por email
    const result = await pool.query(
      'SELECT id, email, password_hash, tipo_usuario, estado FROM usuarios WHERE email = $1',
      [email]
    );
    
    const user = result.rows[0];
    
    // Verificar si el usuario existe y está activo
    if (!user || user.estado !== 'activo') {
      return null;
    }
    
    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return null;
    }
    
    // Si las credenciales son correctas, devolver datos del usuario
    return {
      id: user.id,
      email: user.email,
      tipo_usuario: user.tipo_usuario
    };
  } catch (error) {
    console.error('Error al verificar credenciales:', error);
    return null;
  }
}

/**
 * Obtener datos adicionales del usuario según su tipo
 */
async function getUserDetails(userId, userType) {
  try {
    let userDetails = {};
    
    if (userType === 'marca') {
      // Obtener datos de la marca asociada al usuario
      const result = await pool.query(`
        SELECT m.* 
        FROM marcas m
        JOIN equipos e ON m.id_equipo = e.id
        JOIN miembros_equipo me ON e.id = me.id_equipo
        WHERE me.id_usuario = $1
      `, [userId]);
      
      if (result.rows.length > 0) {
        userDetails = {
          ...result.rows[0],
          role: 'marca'
        };
      }
    } else if (userType === 'showroom') {
      // Obtener datos del showroom asociado al usuario
      const result = await pool.query(`
        SELECT s.* 
        FROM showrooms s
        JOIN equipos e ON s.id_equipo = e.id
        JOIN miembros_equipo me ON e.id = me.id_equipo
        WHERE me.id_usuario = $1
      `, [userId]);
      
      if (result.rows.length > 0) {
        userDetails = {
          ...result.rows[0],
          role: 'showroom'
        };
      }
    }
    
    return userDetails;
  } catch (error) {
    console.error('Error al obtener detalles del usuario:', error);
    return {};
  }
}

const handler = NextAuth({
  // Usar el adaptador PostgreSQL con el pool de conexiones
  adapter: PostgresAdapter(pool),
  
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const user = await verifyCredentials(credentials);
        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          google_id: profile.sub,
          tipo_usuario: null // Se establecerá durante el proceso de onboarding
        };
      }
    }),
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Si el usuario acaba de iniciar sesión, agregar datos adicionales al token
      if (user) {
        token.id = user.id;
        token.tipo_usuario = user.tipo_usuario;
        
        // Obtener detalles adicionales según el tipo de usuario
        const userDetails = await getUserDetails(user.id, user.tipo_usuario);
        token.userDetails = userDetails;
      }
      
      // Si hay una actualización de sesión, actualizar el token
      if (trigger === "update" && session) {
        if (session.tipo_usuario) token.tipo_usuario = session.tipo_usuario;
        if (session.userDetails) token.userDetails = session.userDetails;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Pasar datos del token a la sesión
      session.user.id = token.id;
      session.user.tipo_usuario = token.tipo_usuario;
      session.user.userDetails = token.userDetails;
      
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirigir a la página correcta después del login
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith('/')) return new URL(url, baseUrl).toString();
      return baseUrl;
    }
  },
  
  pages: {
    signIn: '/iniciar-sesion',
    error: '/iniciar-sesion',
    newUser: '/onboarding'
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Si es un nuevo usuario de Google, marcar para completar onboarding
      if (isNewUser && account.provider === 'google') {
        // Actualizar el usuario creado para requerir completar el perfil
        await pool.query(
          'UPDATE usuarios SET metadata = jsonb_set(COALESCE(metadata, \'{}\'), \'{onboarding_required}\', \'true\') WHERE id = $1',
          [user.id]
        );
      }
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };