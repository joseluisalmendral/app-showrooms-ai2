import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// Importación corregida del adaptador PostgreSQL
import PostgresAdapter from '@auth/pg-adapter';
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
    
    console.log(`Verificando credenciales para ${email}`);
    
    // Buscar el usuario por email
    const result = await pool.query(
      'SELECT id, email, password_hash, tipo_usuario, estado FROM usuarios WHERE email = $1',
      [email]
    );
    
    const user = result.rows[0];
    
    // Verificar si el usuario existe y está activo
    if (!user) {
      console.log(`Usuario no encontrado para ${email}`);
      return null;
    }
    
    if (user.estado !== 'activo') {
      console.log(`Usuario encontrado pero inactivo: ${email}, estado: ${user.estado}`);
      return null;
    }
    
    // Verificar la contraseña
    console.log(`Comparando contraseña para ${email}`);
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      console.log(`Contraseña incorrecta para ${email}`);
      return null;
    }
    
    console.log(`Autenticación exitosa para ${email}, tipo: ${user.tipo_usuario}`);
    
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
        console.log('Autorización de credenciales iniciada para email:', credentials?.email);
        
        try {
          // Validación básica
          if (!credentials?.email || !credentials?.password) {
            console.log('Credenciales incompletas');
            return null;
          }
          
          const user = await verifyCredentials(credentials);
          
          if (!user) {
            console.log('Usuario no encontrado o credenciales inválidas');
            return null;
          }
          
          console.log('Usuario autenticado correctamente:', {
            id: user.id,
            email: user.email,
            tipo_usuario: user.tipo_usuario
          });
          
          return user;
        } catch (error) {
          console.error('Error en el proceso de autorización:', error);
          return null;
        }
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
        console.log("JWT callback - user data:", user); // Log para depuración
        token.id = user.id;
        
        // Asegurar que el tipo de usuario sea válido y mantenga consistencia
        // Preferencia: usar el tipo explícito que viene de la autenticación, fallback al rol en userDetails
        token.tipo_usuario = user.tipo_usuario || 
                             (user.userDetails?.role === 'marca' || user.userDetails?.role === 'showroom' 
                              ? user.userDetails.role : 'marca');
        
        // Obtener detalles adicionales según el tipo de usuario
        const userDetails = await getUserDetails(user.id, token.tipo_usuario);
        token.userDetails = userDetails;
        
        // Registrar el tipo de usuario establecido para depuración
        console.log("JWT callback - tipo_usuario establecido:", token.tipo_usuario);
      }
      
      // Si hay una actualización de sesión, actualizar el token
      if (trigger === "update" && session) {
        if (session.tipo_usuario) token.tipo_usuario = session.tipo_usuario;
        if (session.userDetails) token.userDetails = session.userDetails;
        console.log("JWT callback - token actualizado con:", { tipo_usuario: token.tipo_usuario });
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Pasar datos del token a la sesión
      if (token) {
        if (!session.user) {
          session.user = {};
        }
        session.user.id = token.id;
        session.user.tipo_usuario = token.tipo_usuario;
        session.user.userDetails = token.userDetails;
        
        // Asegurar que la sesión siempre tenga un tipo_usuario válido
        if (!session.user.tipo_usuario) {
          console.warn("Sesión sin tipo_usuario, estableciendo valor por defecto: marca");
          session.user.tipo_usuario = 'marca';
        }
      }
      
      console.log("Session callback - session data final:", { 
        id: session?.user?.id,
        email: session?.user?.email,
        tipo_usuario: session?.user?.tipo_usuario,
        userDetails: session?.user?.userDetails ? 'available' : 'not available'
      });
      
      return session;
    },
    
    // También mejorar el callback de redirect para un mejor manejo de las redirecciones
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl);
      
      // Si es una URL completa, usar directamente
      if (url.startsWith('http') || url.startsWith('https')) {
        return url;
      }
      
      // Redirecciones de autenticación (sign-in, error, etc.)
      if (url.includes('/api/auth/signin') || url === baseUrl || url.includes('/api/auth/callback')) {
        // Usar página intermedia de redirección con querystring para debug
        return `${baseUrl}/auth-redirect?source=signin&timestamp=${Date.now()}`;
      }
      
      // Redirecciones de error de autenticación
      if (url.includes('/api/auth/error')) {
        return `${baseUrl}/iniciar-sesion?error=auth_error&timestamp=${Date.now()}`;
      }
      
      // Para callbackUrls explícitos, respetarlos
      const callbackUrl = new URL(url, baseUrl).searchParams.get('callbackUrl');
      if (callbackUrl) {
        // Si hay un callbackUrl explícito, usarlo
        try {
          const decodedCallbackUrl = decodeURIComponent(callbackUrl);
          if (decodedCallbackUrl.startsWith('/')) {
            // Para rutas internas, añadir el baseUrl
            return `${baseUrl}${decodedCallbackUrl}`;
          }
          // Para URLs externas, verificar que sean seguras antes de redirigir
          if (decodedCallbackUrl.startsWith('http')) {
            const callbackDomain = new URL(decodedCallbackUrl).hostname;
            const baseDomain = new URL(baseUrl).hostname;
            // Solo permitir redirecciones al mismo dominio
            if (callbackDomain === baseDomain) {
              return decodedCallbackUrl;
            }
          }
        } catch (e) {
          console.error("Error procesando callbackUrl:", e);
        }
      }
      
      // Para URLs internas, mantener el comportamiento estándar
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Por defecto, redirigir a /auth-redirect
      return `${baseUrl}/auth-redirect`;
    }
  },
  
  pages: {
    signIn: '/iniciar-sesion',
    error: '/iniciar-sesion',
    newUser: '/onboarding'
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("SignIn event:", { user, isNewUser }); // Log para depuración
      
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

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };