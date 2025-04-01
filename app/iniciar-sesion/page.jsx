'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function IniciarSesion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  
  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/auth-redirect');
    }
  }, [status, router]);
  
  const callbackUrl = searchParams.get('callbackUrl') || '/auth-redirect';
  const errorParam = searchParams.get('error');
  
  const [userType, setUserType] = useState('marca'); // 'marca' o 'showroom'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Manejar errores de autenticación
  const getErrorMessage = (error) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Email o contraseña incorrectos';
      case 'OAuthAccountNotLinked':
        return 'Esta cuenta ya está asociada a un método de inicio de sesión diferente';
      case 'OAuthSignInFailed':
        return 'Error al iniciar sesión con Google. Intenta de nuevo';
      default:
        return 'Error al iniciar sesión. Intenta de nuevo';
    }
  };

  // Si hay un error en la URL, mostrarlo
  useEffect(() => {
    if (errorParam) {
      setLoginError(getErrorMessage(errorParam));
    }
  }, [errorParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setLoginError('Por favor, rellena todos los campos');
      return;
    }
    
    try {
      setIsLoading(true);
      setLoginError('');
      
      // Intentar iniciar sesión con credenciales
      console.log('Iniciando sesión con:', { email, password, userType });
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        tipo_usuario: userType // Asegurarse de pasar este valor al backend
      });
      
      console.log('Resultado inicio sesión:', result);
      
      if (result?.error) {
        setLoginError(getErrorMessage(result.error));
        setIsLoading(false);
      } else {
        // Usar window.location.href para forzar una recarga completa
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setLoginError('Error inesperado. Intenta de nuevo');
      setIsLoading(false);
    }
  };

  // Iniciar sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Pasar el tipo de usuario como parámetro state
      await signIn('google', { 
        callbackUrl: `/auth-redirect?userType=${userType}`,
      });
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setLoginError('Error al iniciar sesión con Google');
      setIsLoading(false);
    }
  };

  // Si ya está autenticado, mostrar cargando mientras redirige
  if (status === 'authenticated' || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-mauve-600"></div>
          <p className="mt-4 text-brand-neutral-700">
            {status === 'authenticated' ? 'Ya has iniciado sesión, redirigiendo...' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-neutral-900">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-brand-neutral-600">
            O{' '}
            <Link
              href="/registro"
              className="font-medium text-brand-mauve-600 hover:text-brand-mauve-500"
            >
              regístrate si aún no tienes una cuenta
            </Link>
          </p>
        </div>

        {/* Selector de tipo de usuario */}
        <div className="flex border border-brand-neutral-200 rounded-lg mb-6 overflow-hidden">
          <button
            className={`flex-1 py-2 text-center ${
              userType === "marca"
                ? "bg-brand-mauve-300 text-white"
                : "bg-white text-brand-neutral-700 hover:bg-brand-neutral-50"
            }`}
            onClick={() => setUserType("marca")}
            type="button"
          >
            Soy una marca
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              userType === "showroom"
                ? "bg-brand-mauve-300 text-white"
                : "bg-white text-brand-neutral-700 hover:bg-brand-neutral-50"
            }`}
            onClick={() => setUserType("showroom")}
            type="button"
          >
            Tengo un showroom
          </button>
        </div>

        {/* Mostrar mensaje de error si existe */}
        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {loginError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-2 px-3 text-brand-neutral-900 ring-1 ring-inset ring-brand-neutral-300 placeholder:text-brand-neutral-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-brand-mauve-300"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-2 px-3 text-brand-neutral-900 ring-1 ring-inset ring-brand-neutral-300 placeholder:text-brand-neutral-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-brand-mauve-300"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-brand-neutral-300 text-brand-mauve-600 focus:ring-brand-mauve-300"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-brand-neutral-700">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/recuperar-contrasena"
                className="font-medium text-brand-mauve-600 hover:text-brand-mauve-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-brand-mauve-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-mauve-700 focus:outline-none focus:ring-2 focus:ring-brand-mauve-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-brand-neutral-500">O continúa con</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center btn btn-outline py-2 px-4 border border-brand-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-brand-neutral-700 hover:bg-brand-neutral-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar con Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}