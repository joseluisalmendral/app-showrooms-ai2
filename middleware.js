import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Rutas que requieren autenticación
  const protectedPaths = [
    '/dashboard',
    '/perfil',
    '/mensajes',
    '/notificaciones',
    '/configuracion',
    '/colaboraciones',
    '/solicitudes',
    '/disponibilidad'
  ];
  
  // Comprobar si la ruta actual está protegida
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Log para depuración
  console.log(`Middleware - Verificando ruta: ${pathname}, Protegida: ${isProtectedPath}`);
  
  if (isProtectedPath) {
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });
      
      // Log del token para depuración
      console.log(`Middleware - Token encontrado: ${!!token}, Tipo usuario: ${token?.tipo_usuario || 'no definido'}`);
      
      // Si no hay token (usuario no autenticado), redirigir a iniciar sesión
      if (!token) {
        // Guardar la URL a la que el usuario intentaba acceder para redireccionar después del login
        const url = new URL('/iniciar-sesion', request.url);
        url.searchParams.set('callbackUrl', encodeURI(pathname));
        
        console.log(`Middleware - Redirigiendo a login con callbackUrl: ${pathname}`);
        return NextResponse.redirect(url);
      }
      
      // Establecer un tipo de usuario por defecto si no existe
      const userType = token.tipo_usuario || (
        pathname.includes('/marca') ? 'marca' : 
        pathname.includes('/showroom') ? 'showroom' : 
        'marca' // valor por defecto
      );
      
      // Rutas específicas para tipos de usuario
      if (pathname.startsWith('/dashboard/marca') && userType !== 'marca') {
        console.log(`Middleware - Acceso incorrecto al dashboard, redirigiendo a: /dashboard/${userType}`);
        // Redirigir a la página de dashboard correcta si intenta acceder al dashboard equivocado
        return NextResponse.redirect(new URL(`/dashboard/${userType}`, request.url));
      }
      
      if (pathname.startsWith('/dashboard/showroom') && userType !== 'showroom') {
        console.log(`Middleware - Acceso incorrecto al dashboard, redirigiendo a: /dashboard/${userType}`);
        // Redirigir a la página de dashboard correcta si intenta acceder al dashboard equivocado
        return NextResponse.redirect(new URL(`/dashboard/${userType}`, request.url));
      }
    } catch (error) {
      console.error('Middleware - Error al verificar autenticación:', error);
      // En caso de error al verificar el token, redirigir a login
      return NextResponse.redirect(new URL('/iniciar-sesion?error=auth_error', request.url));
    }
  }
  
  // Rutas para usuarios no autenticados
  if (pathname.startsWith('/iniciar-sesion') || pathname.startsWith('/registro')) {
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });
      
      // Si el usuario ya está autenticado, redirigir al dashboard
      if (token) {
        // Asegúrate de que siempre haya un tipo de usuario válido
        const userType = token.tipo_usuario || 'marca';
        
        console.log(`Middleware - Usuario autenticado: ${token.email}, Tipo: ${userType}`);
        
        // Si la ruta actual es específica para un tipo de usuario diferente
        if (pathname.startsWith('/dashboard/marca') && userType !== 'marca') {
          return NextResponse.redirect(new URL(`/dashboard/${userType}`, request.url));
        }
        
        if (pathname.startsWith('/dashboard/showroom') && userType !== 'showroom') {
          return NextResponse.redirect(new URL(`/dashboard/${userType}`, request.url));
        }
      }
    } catch (error) {
      console.error('Middleware - Error al verificar token para rutas públicas:', error);
      // Continuar con la navegación normal en caso de error
    }
  }
  
  // Si no se requiere redirección, continuar
  return NextResponse.next();
}

// Configurar en qué rutas se debe ejecutar el middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/perfil/:path*',
    '/mensajes/:path*',
    '/notificaciones/:path*',
    '/configuracion/:path*',
    '/colaboraciones/:path*',
    '/solicitudes/:path*',
    '/disponibilidad/:path*',
    '/iniciar-sesion',
    '/registro'
  ]
};