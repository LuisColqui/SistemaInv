import React, { useState } from 'react';
import { authService } from '../services/authService';
import Sidebar from '../components/Sidebar';
import DashboardContent from '../components/DashboardContent';
import { 
  ProductosPage, 
  InventarioPage, 
  CategoriasPage, 
  ProveedoresPage, 
  MovimientosPage, 
  ReportesPage, 
  ConfiguracionPage 
} from '../components/PageComponents';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const user = authService.getCurrentUser();
  const empresa = user?.empresa;

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // Forzar recarga para volver al login
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      productos: 'Gestión de Productos',
      inventario: 'Control de Inventario',
      categorias: 'Gestión de Categorías',
      proveedores: 'Gestión de Proveedores',
      movimientos: 'Historial de Movimientos',
      reportes: 'Reportes y Estadísticas',
      configuracion: 'Configuración del Sistema'
    };
    return titles[currentPage] || 'Dashboard';
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent user={user} empresa={empresa} />;
      case 'productos':
        return <ProductosPage />;
      case 'inventario':
        return <InventarioPage />;
      case 'categorias':
        return <CategoriasPage />;
      case 'proveedores':
        return <ProveedoresPage />;
      case 'movimientos':
        return <MovimientosPage />;
      case 'reportes':
        return <ReportesPage />;
      case 'configuracion':
        return <ConfiguracionPage />;
      default:
        return <DashboardContent user={user} empresa={empresa} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                {empresa && currentPage === 'dashboard' && (
                  <p className="text-sm text-gray-500 mt-1">
                    {empresa.nombreEmpresa}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {/* Notificaciones */}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 21H6a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v6.5" />
                  </svg>
                </button>
                
                {/* Información del usuario */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.tipoUsuario}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.nombre?.[0]}{user?.apellido?.[0]}
                    </span>
                  </div>
                </div>
                
                {/* Botón de cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ease-in-out flex items-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;