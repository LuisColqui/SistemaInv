import React from 'react';
import EmpresaConfig from './EmpresaConfig';
import ProductosManager from './ProductosManager';

const PagePlaceholder = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md">{description}</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <p className="text-blue-800 text-sm">
            <span className="font-medium">🚀 En desarrollo:</span> Esta funcionalidad será implementada próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componentes específicos para cada página
export const ProductosPage = () => {
  return <ProductosManager />;
};

export const InventarioPage = () => (
  <PagePlaceholder
    title="Control de Inventario"
    description="Monitorea el stock, entradas, salidas y niveles de inventario."
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    }
  />
);

export const CategoriasPage = () => (
  <PagePlaceholder
    title="Gestión de Categorías"
    description="Organiza tus productos en categorías y subcategorías."
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l2 2-2 2M5 13l-2-2 2-2m0-2h14v14H3V4z" />
      </svg>
    }
  />
);

export const ProveedoresPage = () => (
  <PagePlaceholder
    title="Gestión de Proveedores"
    description="Administra la información de tus proveedores y contactos."
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
  />
);

export const MovimientosPage = () => (
  <PagePlaceholder
    title="Historial de Movimientos"
    description="Consulta el historial de entradas y salidas de inventario."
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    }
  />
);

export const ReportesPage = () => (
  <PagePlaceholder
    title="Reportes y Estadísticas"
    description="Genera reportes detallados y analiza estadísticas de tu inventario."
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    }
  />
);

export const ConfiguracionPage = () => {
  return <EmpresaConfig />;
};