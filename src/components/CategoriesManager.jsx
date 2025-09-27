import React, { useState } from 'react';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';

const CategoriesManager = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setCurrentView('form');
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView('form');
  };

  const handleCancelForm = () => {
    setSelectedCategory(null);
    setCurrentView('list');
  };

  const handleSaveCategory = (savedCategory, action) => {
    setSelectedCategory(null);
    setCurrentView('list');
    setRefreshTrigger((prev) => prev + 1);

    const actionText = action === 'created' ? 'creada' : 'actualizada';
    showMessage(`Categoría "${savedCategory.nombreCategoria}" ${actionText} correctamente`);
  };

  return (
    <div className="space-y-6">
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
            <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M9 3v2m6-2v2M4 9h16l-1 12H5L4 9z" />
              </svg>
              Categorías
            </button>
          </li>
          {currentView === 'form' && (
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-500 ml-1 md:ml-2">
                  {selectedCategory ? 'Editar' : 'Nueva'}
                </span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div>
        {currentView === 'list' ? (
          <CategoryList
            onNewCategory={handleNewCategory}
            onEditCategory={handleEditCategory}
            refreshTrigger={refreshTrigger}
          />
        ) : (
          <CategoryForm
            category={selectedCategory}
            onSave={handleSaveCategory}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesManager;
