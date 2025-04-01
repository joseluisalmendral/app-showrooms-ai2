'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // Log detallado para depuración
    console.log('AuthRedirect - Estado sesión:', status);
    console.log('AuthRedirect - Datos sesión:', session);
    
    // Esperar hasta que la sesión esté lista
    if (status === 'loading') return;
    
    // Si el usuario está autenticado
    if (status === 'authenticated' && session?.user) {
      console.log('Usuario autenticado:', {
        name: session?.user?.name,
        email: session?.user?.email,
        tipo_usuario: session?.user?.tipo_usuario,
        userDetails: session?.user?.userDetails
      });
      
      // Obtener tipo de usuario con fallbacks
      let userType = session?.user?.tipo_usuario;
      
      if (!userType && session?.user?.userDetails?.role) {
        console.log('Usando rol desde userDetails como tipo de usuario fallback');
        userType = session.user.userDetails.role;
        
        // Actualizar la sesión con el tipo detectado
        update({ tipo_usuario: userType });
      }
      
      // Si aún no hay tipo de usuario, establecer 'marca' como predeterminado
      if (!userType) {
        userType = 'marca';
        console.log('Tipo de usuario no detectado, usando valor predeterminado:', userType);
      }
      
      // Navegar directamente a la página correcta
      window.location.href = `/dashboard/${userType}`;
    } else if (status === 'unauthenticated') {
      // Si no está autenticado, redirigir a login
      window.location.href = '/iniciar-sesion';
    }
  }, [status, session, update]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-neutral-50">
      <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-mauve-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-brand-neutral-900 mb-2">Configurando tu sesión</h2>
        <p className="text-brand-neutral-700 mb-4">
          Estamos preparando tu experiencia personalizada...
        </p>
        <p className="mt-2 text-sm text-brand-neutral-500">
          {redirectAttempts > 0 ? 
            `Intentando conectar (${redirectAttempts}/8)...` : 
            'Verificando tu sesión...'}
        </p>
        
        {redirectAttempts >= 5 && (
          <div className="mt-6 p-4 bg-brand-neutral-100 rounded-lg text-sm text-brand-neutral-700">
            <p className="mb-2">¿Está tardando demasiado?</p>
            <button 
              onClick={() => router.push('/iniciar-sesion')}
              className="text-brand-mauve-600 hover:text-brand-mauve-700 font-medium"
            >
              Volver a iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}