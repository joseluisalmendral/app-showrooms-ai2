'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Registro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get('tipo');
  
  const [userType, setUserType] = useState(tipoParam || 'marca');
  const [step, setStep] = useState(1); // 1: Datos básicos, 2: Información específica
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos básicos de usuario (paso 1)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    terminosAceptados: false
  });
  
  // Datos específicos según el tipo de usuario (paso 2)
  const [specificData, setSpecificData] = useState({
    // Para marcas
    nombreMarca: '',
    anioFundacion: '',
    descripcionMarca: '',
    estilosMarca: [],
    
    // Para showrooms
    nombreShowroom: '',
    direccion: '',
    ciudad: '',
    capacidadMarcas: '',
    descripcionShowroom: '',
    estilosShowroom: []
  });
  
  // Lista de estilos disponibles
  const estilosDisponibles = [
    { id: 'casual', nombre: 'Casual' },
    { id: 'urbano', nombre: 'Urbano' },
    { id: 'formal', nombre: 'Formal' },
    { id: 'streetwear', nombre: 'Streetwear' },
    { id: 'sostenible', nombre: 'Sostenible' },
    { id: 'vintage', nombre: 'Vintage' },
    { id: 'minimalista', nombre: 'Minimalista' },
    { id: 'deportivo', nombre: 'Deportivo' }
  ];
  
  // Lista de ciudades para el dropdown
  const ciudadesDisponibles = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Zaragoza',
    'Málaga',
    'Bilbao',
    'Alicante',
    'Murcia',
    'Las Palmas',
    'Valladolid'
  ];

  // Actualizar el tipo de usuario cuando cambia en la URL
  useEffect(() => {
    if (tipoParam && (tipoParam === 'marca' || tipoParam === 'showroom')) {
      setUserType(tipoParam);
    }
  }, [tipoParam]);

  // Manejar cambios en el formulario básico
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Manejar cambios en el formulario específico
  const handleSpecificChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'estilosMarca' || name === 'estilosShowroom') {
      // Para checkboxes de estilos
      const estiloId = value;
      const estilosActuales = specificData[name];
      
      if (checked) {
        // Añadir estilo si está marcado
        setSpecificData({
          ...specificData,
          [name]: [...estilosActuales, estiloId]
        });
      } else {
        // Quitar estilo si está desmarcado
        setSpecificData({
          ...specificData,
          [name]: estilosActuales.filter(id => id !== estiloId)
        });
      }
    } else {
      // Para otros campos
      setSpecificData({
        ...specificData,
        [name]: value
      });
    }
  };

  // Validar el formulario del paso 1
  const validateStep1 = () => {
    // Validar que todos los campos requeridos estén rellenos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      setError('Por favor, completa todos los campos obligatorios');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El email no tiene un formato válido');
      return false;
    }
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    // Validar longitud de contraseña
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    // Validar aceptación de términos
    if (!formData.terminosAceptados) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }
    
    return true;
  };
  
  // Validar el formulario del paso 2
  const validateStep2 = () => {
    if (userType === 'marca') {
      // Validar campos de marca
      if (!specificData.nombreMarca) {
        setError('Por favor, ingresa el nombre de tu marca');
        return false;
      }
      
      if (specificData.estilosMarca.length === 0) {
        setError('Por favor, selecciona al menos un estilo para tu marca');
        return false;
      }
    } else {
      // Validar campos de showroom
      if (!specificData.nombreShowroom || !specificData.direccion || !specificData.ciudad) {
        setError('Por favor, completa todos los campos obligatorios del showroom');
        return false;
      }
      
      if (specificData.estilosShowroom.length === 0) {
        setError('Por favor, selecciona al menos un estilo para tu showroom');
        return false;
      }
    }
    
    return true;
  };

  // Avanzar al siguiente paso
  const nextStep = () => {
    if (validateStep1()) {
      setError('');
      setStep(2);
    }
  };
  
  // Volver al paso anterior
  const prevStep = () => {
    setError('');
    setStep(1);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      nextStep();
      return;
    }
    
    if (!validateStep2()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Preparar los datos para enviar al servidor
      const userData = {
        ...formData,
        tipo_usuario: userType,
        ...(userType === 'marca' ? {
          nombreMarca: specificData.nombreMarca,
          anioFundacion: specificData.anioFundacion,
          descripcionMarca: specificData.descripcionMarca,
          estilosMarca: specificData.estilosMarca
        } : {
          nombreShowroom: specificData.nombreShowroom,
          direccion: specificData.direccion,
          ciudad: specificData.ciudad,
          capacidadMarcas: specificData.capacidadMarcas,
          descripcionShowroom: specificData.descripcionShowroom,
          estilosShowroom: specificData.estilosShowroom
        })
      };
      
      // Realizar petición al endpoint de registro
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }
      
      // Registro exitoso, iniciar sesión automáticamente
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });
      
      // Redirigir al dashboard correspondiente
      router.push(userType === 'marca' ? '/dashboard/marca' : '/dashboard/showroom');
      
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al registrarse. Intenta de nuevo');
      setIsLoading(false);
    }
  };

  // Contenido específico según el paso actual
  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-neutral-900 mb-2">
              Información personal
            </h2>
            <p className="text-brand-neutral-600">
              Completa tus datos personales para crear tu cuenta
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                  Nombre*
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                  Apellido*
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Correo electrónico*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Contraseña*
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-brand-neutral-500">
                Mínimo 8 caracteres
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Confirmar contraseña*
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terminosAceptados"
                  name="terminosAceptados"
                  type="checkbox"
                  className="h-4 w-4 text-brand-mauve-600 focus:ring-brand-mauve-300 border-brand-neutral-300 rounded"
                  checked={formData.terminosAceptados}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terminosAceptados" className="font-medium text-brand-neutral-700">
                  Acepto los <Link href="/terminos" className="text-brand-mauve-600 hover:text-brand-mauve-500">Términos y Condiciones</Link> y la <Link href="/privacidad" className="text-brand-mauve-600 hover:text-brand-mauve-500">Política de Privacidad</Link>*
                </label>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      // Paso 2: Información específica según el tipo de usuario
      return userType === 'marca' ? (
        // Formulario para marcas
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-neutral-900 mb-2">
              Información de tu marca
            </h2>
            <p className="text-brand-neutral-600">
              Cuéntanos más sobre tu marca para ayudarte a encontrar los showrooms ideales
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="nombreMarca" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Nombre de la marca*
              </label>
              <input
                id="nombreMarca"
                name="nombreMarca"
                type="text"
                required
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.nombreMarca}
                onChange={handleSpecificChange}
              />
            </div>
            
            <div>
              <label htmlFor="anioFundacion" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Año de fundación
              </label>
              <input
                id="anioFundacion"
                name="anioFundacion"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.anioFundacion}
                onChange={handleSpecificChange}
              />
            </div>
            
            <div>
              <label htmlFor="descripcionMarca" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Descripción de la marca
              </label>
              <textarea
                id="descripcionMarca"
                name="descripcionMarca"
                rows="3"
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.descripcionMarca}
                onChange={handleSpecificChange}
                placeholder="Describe brevemente tu marca, productos y valores"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                Estilos de la marca*
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {estilosDisponibles.map((estilo) => (
                  <div key={estilo.id} className="flex items-center">
                    <input
                      id={`estilo-${estilo.id}`}
                      name="estilosMarca"
                      type="checkbox"
                      value={estilo.id}
                      checked={specificData.estilosMarca.includes(estilo.id)}
                      onChange={handleSpecificChange}
                      className="h-4 w-4 text-brand-mauve-600 focus:ring-brand-mauve-300 border-brand-neutral-300 rounded"
                    />
                    <label htmlFor={`estilo-${estilo.id}`} className="ml-2 text-sm text-brand-neutral-700">
                      {estilo.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Formulario para showrooms
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-neutral-900 mb-2">
              Información de tu showroom
            </h2>
            <p className="text-brand-neutral-600">
              Cuéntanos más sobre tu espacio para conectarte con las marcas adecuadas
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="nombreShowroom" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Nombre del showroom*
              </label>
              <input
                id="nombreShowroom"
                name="nombreShowroom"
                type="text"
                required
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.nombreShowroom}
                onChange={handleSpecificChange}
              />
            </div>
            
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Dirección*
              </label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                required
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.direccion}
                onChange={handleSpecificChange}
                placeholder="Calle, número, código postal"
              />
            </div>
            
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Ciudad*
              </label>
              <select
                id="ciudad"
                name="ciudad"
                required
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.ciudad}
                onChange={handleSpecificChange}
              >
                <option value="">Selecciona una ciudad</option>
                {ciudadesDisponibles.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="capacidadMarcas" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Capacidad (número de marcas)
              </label>
              <input
                id="capacidadMarcas"
                name="capacidadMarcas"
                type="number"
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.capacidadMarcas}
                onChange={handleSpecificChange}
              />
            </div>
            
            <div>
              <label htmlFor="descripcionShowroom" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                Descripción del showroom
              </label>
              <textarea
                id="descripcionShowroom"
                name="descripcionShowroom"
                rows="3"
                className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-mauve-300 focus:border-brand-mauve-300"
                value={specificData.descripcionShowroom}
                onChange={handleSpecificChange}
                placeholder="Describe tu espacio, instalaciones y características especiales"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                Estilos ideales para tu showroom*
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {estilosDisponibles.map((estilo) => (
                  <div key={estilo.id} className="flex items-center">
                    <input
                      id={`estilo-${estilo.id}`}
                      name="estilosShowroom"
                      type="checkbox"
                      value={estilo.id}
                      checked={specificData.estilosShowroom.includes(estilo.id)}
                      onChange={handleSpecificChange}
                      className="h-4 w-4 text-brand-mauve-600 focus:ring-brand-mauve-300 border-brand-neutral-300 rounded"
                    />
                    <label htmlFor={`estilo-${estilo.id}`} className="ml-2 text-sm text-brand-neutral-700">
                      {estilo.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-brand-neutral-900">
              {userType === 'marca' ? 'Registro para Marcas' : 'Registro para Showrooms'}
            </h1>
            <p className="mt-2 text-center text-brand-neutral-600">
              Únete a nuestra plataforma y potencia tu negocio
            </p>
          </div>

          {/* Selector de tipo de usuario */}
          <div className="flex border border-brand-neutral-200 rounded-lg mb-8 overflow-hidden">
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

          {/* Indicador de progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === 1 ? 'bg-brand-mauve-600 text-white' : 'bg-brand-mauve-200 text-brand-mauve-800'
                }`}>
                  1
                </div>
                <div className="ml-2 text-sm font-medium text-brand-neutral-700">
                  Datos básicos
                </div>
              </div>
              <div className={`flex-1 h-1 mx-4 ${step === 1 ? 'bg-brand-neutral-200' : 'bg-brand-mauve-300'}`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === 2 ? 'bg-brand-mauve-600 text-white' : 'bg-brand-neutral-200 text-brand-neutral-500'
                }`}>
                  2
                </div>
                <div className="ml-2 text-sm font-medium text-brand-neutral-700">
                  {userType === 'marca' ? 'Datos de marca' : 'Datos de showroom'}
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-brand-neutral-300 rounded-md text-brand-neutral-700 hover:bg-brand-neutral-50"
                >
                  Anterior
                </button>
              ) : (
                <Link
                  href="/iniciar-sesion"
                  className="px-4 py-2 text-brand-neutral-600 hover:text-brand-neutral-900"
                >
                  Ya tengo cuenta
                </Link>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-brand-mauve-600 text-white rounded-md hover:bg-brand-mauve-700 focus:outline-none focus:ring-2 focus:ring-brand-mauve-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading
                  ? 'Procesando...'
                  : step === 1
                  ? 'Siguiente'
                  : 'Completar registro'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-brand-neutral-200">
            <div className="text-center text-sm text-brand-neutral-600">
              ¿O prefieres iniciar sesión con Google?
            </div>
            <div className="mt-3">
              <button
                onClick={() => signIn('google', { callbackUrl: `/onboarding?userType=${userType}` })}
                className="w-full flex items-center justify-center px-4 py-2 border border-brand-neutral-300 rounded-md shadow-sm text-sm font-medium text-brand-neutral-700 bg-white hover:bg-brand-neutral-50"
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
    </div>
  );
}