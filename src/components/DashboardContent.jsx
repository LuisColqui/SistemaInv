import React from 'react';

const DashboardContent = ({ user, empresa }) => {
  return (
    <div>
      {/* Header de bienvenida */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            ¡Bienvenido al Dashboard!
          </h2>
          <p className="text-indigo-100">
            Gestiona tu inventario de manera eficiente y organizada
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Usuario */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800">
              Información del Usuario
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Nombre Completo:</span>
              <span className="font-medium">{user?.nombre} {user?.apellido}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Correo:</span>
              <span className="font-medium">{user?.correo}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Tipo de Usuario:</span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                user?.tipoUsuario === 'ADMINISTRADOR' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.tipoUsuario}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">ID Usuario:</span>
              <span className="font-medium">#{user?.idUsuario}</span>
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        {empresa && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">
                Información de la Empresa
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">{empresa.nombreEmpresa}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">RUC:</span>
                <span className="font-medium">{empresa.rucEmpresa}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Dirección:</span>
                <span className="font-medium text-right max-w-xs">{empresa.direccionEmpresa}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Teléfono:</span>
                <span className="font-medium">{empresa.telefonoEmpresa}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{empresa.emailEmpresa}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Estado:</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  empresa.estadoEmpresa 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {empresa.estadoEmpresa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="h-12 w-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">120</h3>
          <p className="text-gray-600 text-sm">Productos Totales</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="h-12 w-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">98</h3>
          <p className="text-gray-600 text-sm">En Stock</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="h-12 w-12 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.73-.833-2.5 0L4.314 15.5C3.544 16.333 4.506 18 6.046 18z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">15</h3>
          <p className="text-gray-600 text-sm">Stock Bajo</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="h-12 w-12 mx-auto bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">7</h3>
          <p className="text-gray-600 text-sm">Sin Stock</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;