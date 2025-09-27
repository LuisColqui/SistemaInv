import React, { useState, useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

const Sidebar = ({ currentPage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10zm8-4h4a2 2 0 012 2v6H9V9a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      id: 'productos',
      name: 'Productos',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'inventario',
      name: 'Inventario',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'categorias',
      name: 'Categorías',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l2 2-2 2M5 13l-2-2 2-2m0-2h14v14H3V4z" />
        </svg>
      ),
    },
    {
      id: 'proveedores',
      name: 'Proveedores',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'movimientos',
      name: 'Movimientos',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      id: 'reportes',
      name: 'Reportes',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'configuracion',
      name: 'Configuración',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`relative bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen border-r border-gray-200 dark:border-gray-700`}>
      {/* Header del Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Sistema</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Inventarios</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cambiar tema"
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm5.303 2.197a.75.75 0 011.06 1.06l-1.06 1.061a.75.75 0 11-1.06-1.06l1.06-1.061zM16.25 10a.75.75 0 010 1.5h-1.5a.75.75 0 010-1.5h1.5zM10 15.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V16a.75.75 0 01.75-.75zM5.5 10a.75.75 0 01-.75.75H3.25a.75.75 0 010-1.5H4.75A.75.75 0 015.5 10zm.97-4.682a.75.75 0 00-1.06-1.06L4.348 5.318a.75.75 0 101.06 1.06l1.061-1.06zM6.53 14.182a.75.75 0 00-1.06 0l-1.06 1.061a.75.75 0 101.06 1.06l1.06-1.06a.75.75 0 000-1.061zM13.47 14.182a.75.75 0 011.06 0l1.061 1.061a.75.75 0 11-1.06 1.06l-1.061-1.06a.75.75 0 010-1.061z" />
                  <circle cx="10" cy="10" r="3" className="fill-yellow-300" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg 
                className={`h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="mt-4 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center px-3 py-3 mb-1 rounded-lg transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-r-2 border-indigo-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <span className={`flex-shrink-0 ${currentPage === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">{item.name}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer del Sidebar */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-3 text-white text-center">
            <div className="text-xs font-medium">Sistema de Inventarios</div>
            <div className="text-xs opacity-75 mt-1">Versión 1.0</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;