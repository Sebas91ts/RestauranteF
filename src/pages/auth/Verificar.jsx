
import { useAuth } from '@/context/AuthContext';
import React from 'react'
import { Link } from 'react-router';

export default function Verificar() {
  const { user } = useAuth();
  if (!user || !user.user || user.user.rol !== 1) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 border border-gray-200 rounded-xl shadow-md text-center bg-white">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Acceso Denegado
        </h2>
        <p className="mb-8 text-gray-700">
          No tienes permisos de administrador para acceder a esta página.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition"
        >
          Ir al Menú de Usuario
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-md mx-auto mt-16 p-8 border border-gray-200 rounded-xl shadow-md text-center bg-white">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Permisos de Administrador
      </h2>
      <p className="mb-8 text-gray-700">
        Se detectó que el usuario tiene permisos de administrador.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-blue-700 text-white rounded-md font-bold hover:bg-blue-800 transition"
        >
          Ir al Dashboard
        </Link>
        <Link
          to="/"
          className="px-6 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition"
        >
          Ir al Menú de Usuario
        </Link>
      </div>
    </div>
  );
}
