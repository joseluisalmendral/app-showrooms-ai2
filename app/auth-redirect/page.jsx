'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  
  useEffect(() => {
    // Log para depuración
    console.log('AuthRedirect - Estado sesión:', status);
    console.log('AuthRedirect - Datos sesión:', session);
    console.log('AuthRedirect - Intentos de redirección:', redirectAttempts);
    
    // Esperar hasta que la sesión esté lista
    if (status === 'loading') return;
    
    if (status === 'authenticated' && session?.user) {
      console.log('Usuario autenticado:', {
        name: session?.user?.name,
        email: session?.user?.email,
        tipo_usuario: session?.user?.tipo_usuario,
        userDetails: session?.user?.userDetails
      });
      
      // Redirigir según el tipo de usuario
      const userType = session?.user?.tipo_usuario;
      
      if (userType === 'marca') {
        router.push('/dashboard/marca');
      } else if (userType === 'showroom') {
        router.push('/dashboard/showroom');
      } else {
        // Si por alguna razón no tenemos tipo de usuario, usar un valor predeterminado
        console.warn('Tipo de usuario no definido, utilizando valor predeterminado "marca"');
        router.push('/dashboard/marca');
      }
    } else if (status === 'unauthenticated') {
      // Si no está autenticado, redirigir a login
      router.push('/iniciar-sesion');
    } else if (redirectAttempts < 5) {
      // Si todavía estamos esperando que la sesión se establezca completamente, intentar de nuevo
      const timer = setTimeout(() => {
        setRedirectAttempts(prev => prev + 1);
      }, 1000); // Esperar 1 segundo antes de intentar de nuevo
      
      return () => clearTimeout(timer);
    } else {
      // Si después de varios intentos no podemos determinar el estado, ir a la página principal
      console.error('No se pudo determinar el estado de autenticación después de varios intentos');
      router.push('/');
    }
  }, [status, session, router, redirectAttempts]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-neutral-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-mauve-600"></div>
        <p className="mt-4 text-brand-neutral-700">Redireccionando...</p>
        <p className="mt-2 text-sm text-brand-neutral-500">
          {redirectAttempts > 0 ? `Intentando conectar (${redirectAttempts})...` : 'Verificando tu sesión...'}
        </p>
      </div>
    </div>
  );
}