import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import { Button } from './ui/Button';
import useToast from '../hooks/useToast';

const ProductosManager = () => {
  // currentView se mantiene solo para el breadcrumb
  const [currentView, setCurrentView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  const { add: pushToast } = useToast();
  const showMessage = (text, type = 'success') => {
    pushToast({
      title: type === 'error' ? 'Error' : type === 'info' ? 'Información' : 'Éxito',
      description: text,
      variant: type,
    });
  };

  const openForm = (product = null) => {
    setSelectedProduct(product);
    setCurrentView('form');
    setIsModalOpen(true);
  };

  const handleNewProduct = () => openForm(null);
  const handleEditProduct = (product) => openForm(product);

  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const performClose = () => {
    setSelectedProduct(null);
    setCurrentView('list');
    setIsModalOpen(false);
    setFormDirty(false);
  };

  const handleCancelForm = () => {
    if (formDirty) {
      setConfirmDiscardOpen(true);
      return;
    }
    performClose();
  };

  const handleSaveProduct = (savedProduct, action) => {
    setSelectedProduct(null);
    setCurrentView('list');
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
    const actionText = action === 'created' ? 'creado' : 'actualizado';
    showMessage(`Producto "${savedProduct.nombreProducto}" ${actionText} correctamente`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <span className="text-sm font-medium text-gray-500">Productos</span>
          </li>
          {currentView === 'form' && (
            <li className="inline-flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-500 ml-1 md:ml-2">
                {selectedProduct ? 'Editar' : 'Nuevo'}
              </span>
            </li>
          )}
        </ol>
      </nav>

      {/* Lista de productos */}
      <ProductList
        onEditProduct={handleEditProduct}
        onNewProduct={handleNewProduct}
        refreshTrigger={refreshTrigger}
      />

      <Modal
        open={isModalOpen}
        title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
        description={selectedProduct ? 'Modifica la información del producto' : 'Completa los datos para registrar un nuevo producto'}
        onClose={handleCancelForm}
        size="full"
        fullHeight={false}
        bodyClassName="pt-2"
        actions={
          <>
            <Button variant="secondary" type="button" onClick={handleCancelForm}>Cancelar</Button>
            <Button variant="primary" type="submit" form="product-form">{selectedProduct ? 'Actualizar' : 'Crear'} Producto</Button>
          </>
        }
      >
        <ProductForm
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
          embedded
          showActions={false}
          formId="product-form"
          onDirtyChange={setFormDirty}
        />
      </Modal>
      <ConfirmDialog
        open={confirmDiscardOpen}
        title="Descartar cambios"
        description="Hay cambios sin guardar. ¿Deseas descartarlos?"
        confirmLabel="Descartar"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={() => {
          setConfirmDiscardOpen(false);
          performClose();
        }}
        onCancel={() => setConfirmDiscardOpen(false)}
      />

      {/* Futuro: modal de confirmación personalizado para cambios no guardados */}
    </div>
  );
};

export default ProductosManager;