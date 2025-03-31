'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Esperar hasta que la sesión esté lista
    if (status === 'loading') return;
    
    if (status === 'authenticated') {
      console.log('Usuario autenticado:', session);
      
      // Redirigir según el tipo de usuario
      const userType = session?.user?.tipo_usuario;
      
      if (userType === 'marca') {
        router.push('/dashboard/marca');
      } else if (userType === 'showroom') {
        router.push('/dashboard/showroom');
      } else {
        // Si por alguna razón no tenemos tipo de usuario, llevar a una página segura
        router.push('/');
      }
    } else {
      // Si no está autenticado, redirigir a login
      router.push('/iniciar-sesion');
    }
  }, [status, session, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-neutral-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-mauve-600"></div>
        <p className="mt-4 text-brand-neutral-700">Redireccionando...</p>
      </div>
    </div>
  );
}