import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const ProductosManager = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'form'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState(null);

  // Función para mostrar mensajes
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000); // Auto-hide después de 5 segundos
  };

  // Manejar creación de nuevo producto
  const handleNewProduct = () => {
    setSelectedProduct(null);
    setCurrentView('form');
    setMessage(null);
  };

  // Manejar edición de producto
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('form');
    setMessage(null);
  };

  // Manejar cancelación del formulario
  const handleCancelForm = () => {
    setSelectedProduct(null);
    setCurrentView('list');
    setMessage(null);
  };

  // Manejar guardado del producto
  const handleSaveProduct = (savedProduct, action) => {
    setSelectedProduct(null);
    setCurrentView('list');
    setRefreshTrigger(prev => prev + 1); // Trigger refresh de la lista
    
    // Mostrar mensaje de éxito
    const actionText = action === 'created' ? 'creado' : 'actualizado';
    showMessage(`Producto "${savedProduct.nombreProducto}" ${actionText} correctamente`);
  };

  // Función para cerrar mensajes manualmente
  const closeMessage = () => {
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de notificación */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : message.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {message.type === 'success' && (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {message.type === 'error' && (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message.type === 'info' && (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={closeMessage}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button
              onClick={() => {
                if (currentView !== 'list') {
                  handleCancelForm();
                }
              }}
              className={`inline-flex items-center text-sm font-medium hover:text-indigo-600 ${
                currentView === 'list' ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos
            </button>
          </li>
          {currentView === 'form' && (
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-500 ml-1 md:ml-2">
                  {selectedProduct ? 'Editar' : 'Nuevo'}
                </span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      {/* Contenido principal */}
      <div>
        {currentView === 'list' ? (
          <ProductList
            onEditProduct={handleEditProduct}
            onNewProduct={handleNewProduct}
            refreshTrigger={refreshTrigger}
          />
        ) : (
          <ProductForm
            product={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelForm}
          />
        )}
      </div>

      {/* Modal de confirmación para cambios no guardados (si fuera necesario) */}
      {/* Este modal se podría implementar más tarde para mejorar la UX */}
    </div>
  );
};

export default ProductosManager;