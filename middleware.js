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
    '/configuracion'
  ];
  
  // Comprobar si la ruta actual está protegida
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  
  if (isProtectedPath) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Si no hay token (usuario no autenticado), redirigir a iniciar sesión
    if (!token) {
      // Guardar la URL a la que el usuario intentaba acceder para redireccionar después del login
      const url = new URL('/iniciar-sesion', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      
      return NextResponse.redirect(url);
    }
    
    // Rutas específicas para tipos de usuario
    if (pathname.startsWith('/dashboard/marca') && token.tipo_usuario !== 'marca') {
      // Redirigir a la página de dashboard correcta si intenta acceder al dashboard equivocado
      return NextResponse.redirect(new URL(`/dashboard/${token.tipo_usuario}`, request.url));
    }
    
    if (pathname.startsWith('/dashboard/showroom') && token.tipo_usuario !== 'showroom') {
      // Redirigir a la página de dashboard correcta si intenta acceder al dashboard equivocado
      return NextResponse.redirect(new URL(`/dashboard/${token.tipo_usuario}`, request.url));
    }
  }
  
  // Rutas para usuarios no autenticados
  if (pathname.startsWith('/iniciar-sesion') || pathname.startsWith('/registro')) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (token) {
      return NextResponse.redirect(new URL(`/dashboard/${token.tipo_usuario}`, request.url));
    }
  }
  
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
    '/iniciar-sesion',
    '/registro'
  ]
};