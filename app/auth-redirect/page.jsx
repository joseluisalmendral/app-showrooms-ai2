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
    console.log('AuthRedirect - Intentos de redirección:', redirectAttempts);
    
    // Evitar procesamiento múltiple
    if (isProcessing) return;
    
    // Esperar hasta que la sesión esté lista
    if (status === 'loading') return;
    
    // Verificación más robusta de la autenticación
    if (status === 'authenticated' && session?.user) {
      // Evitar ejecuciones duplicadas
      setIsProcessing(true);
      
      console.log('Usuario autenticado:', {
        name: session?.user?.name,
        email: session?.user?.email,
        tipo_usuario: session?.user?.tipo_usuario,
        userDetails: session?.user?.userDetails
      });
      
      // Asegurar que el tipo de usuario esté definido
      // Si no está disponible en la sesión, intentar actualizarla
      let userType = session?.user?.tipo_usuario;
      
      if (!userType && session?.user?.userDetails?.role) {
        console.log('Usando rol desde userDetails como tipo de usuario fallback');
        userType = session.user.userDetails.role;
        
        // Actualizar la sesión con el tipo detectado
        update({ tipo_usuario: userType });
      }
      
      // Redirección basada en tipo de usuario con fallback más seguro
      if (userType === 'marca') {
        router.push('/dashboard/marca');
      } else if (userType === 'showroom') {
        router.push('/dashboard/showroom');
      } else {
        // Fallback más seguro con advertencia
        console.warn(`Tipo de usuario indefinido o no reconocido: "${userType}", utilizando valor predeterminado "marca"`);
        router.push('/dashboard/marca');
      }
    } else if (status === 'unauthenticated') {
      // Si no está autenticado, redirigir a login
      router.push('/iniciar-sesion');
    } else if (redirectAttempts < 8) {
      // Intentar más veces con un tiempo de espera incremental
      const timeout = Math.min(1000 * (redirectAttempts + 1), 5000);
      
      console.log(`Esperando ${timeout}ms antes del próximo intento...`);
      
      const timer = setTimeout(() => {
        setRedirectAttempts(prev => prev + 1);
      }, timeout);
      
      return () => clearTimeout(timer);
    } else {
      // Después de varios intentos, ofrecer una opción más clara al usuario
      console.error('No se pudo determinar el estado de autenticación después de varios intentos');
      router.push('/iniciar-sesion?error=session_error');
    }
  }, [status, session, router, redirectAttempts, isProcessing, update]);
  
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