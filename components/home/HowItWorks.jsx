"use client";

import { useState } from "react";
import Link from "next/link";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("marcas"); // "marcas" o "showrooms"

  return (
    <section className="py-20 bg-neutral-50" id="como-funciona">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            Tres pasos sencillos
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Nuestra plataforma está diseñada para hacer el proceso lo más simple
            posible, tanto para marcas como para propietarios de showrooms.
          </p>

          {/* Selector de tabs */}
          <div className="mt-8 inline-flex border border-neutral-300 rounded-lg p-1 bg-white">
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium ${
                activeTab === "marcas"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
              onClick={() => setActiveTab("marcas")}
            >
              Para Marcas
            </button>
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium ${
                activeTab === "showrooms"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
              onClick={() => setActiveTab("showrooms")}
            >
              Para Showrooms
            </button>
          </div>
        </div>

        {/* Pasos para Marcas */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${
            activeTab === "marcas" ? "block" : "hidden"
          }`}
        >
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Paso 1</h3>
            <p className="text-neutral-700 mb-4">
              Explora y filtra showrooms según tus necesidades específicas de
              ubicación, tamaño, estilo y presupuesto.
            </p>
            <Link
              href="/showrooms"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Ver showrooms disponibles
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Paso 2</h3>
            <p className="text-neutral-700 mb-4">
              Contacta directamente con los espacios que te interesan y negocia
              los términos que mejor se adapten a tus necesidades.
            </p>
            <Link
              href="/como-funciona#contacto"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Saber más
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Paso 3</h3>
            <p className="text-neutral-700 mb-4">
              Exhibe tus productos y aumenta tu visibilidad. Aprovecha la
              exposición para impulsar tu marca y atraer nuevos clientes.
            </p>
            <Link
              href="/casos-exito"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Ver casos de éxito
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Pasos para Showrooms */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${
            activeTab === "showrooms" ? "block" : "hidden"
          }`}
        >
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1zm-1 2v-2H8v2h6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Paso 1</h3>
            <p className="text-neutral-700 mb-4">
              Crea un perfil detallado de tu espacio, incluyendo fotos de alta
              calidad, características y servicios que ofreces.
            </p>
            <Link
              href="/registro-showroom"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Registrar mi showroom
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Paso 2</h3>
            <p className="text-neutral-700 mb-4">
              Recibe solicitudes de marcas interesadas en tu espacio y selecciona
              las que mejor se adapten a tu visión y objetivos.
            </p>
            <Link
              href="/como-funciona#solicitudes"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Saber más
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Paso 3</h3>
            <p className="text-neutral-700 mb-4">
              Gestiona tus exhibiciones, optimiza la ocupación de tu espacio y
              genera ingresos constantes con un mínimo esfuerzo.
            </p>
            <Link
              href="/casos-exito?tipo=showroom"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Ver casos de éxito
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/registro"
            className="btn btn-primary py-3 px-8 text-lg shadow-lg hover:shadow-xl"
          >
            Registrarme ahora
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;