import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreCategoria: '',
    descripcionCategoria: '',
    estadoCategoria: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (category) {
      setIsEditing(true);
      setFormData({
        nombreCategoria: category.nombreCategoria || '',
        descripcionCategoria: category.descripcionCategoria || '',
        estadoCategoria: category.estadoCategoria !== undefined ? category.estadoCategoria : true
      });
    } else {
      setIsEditing(false);
      setFormData({
        nombreCategoria: '',
        descripcionCategoria: '',
        estadoCategoria: true
      });
    }
    setErrors({});
  }, [category]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCategoria.trim()) {
      newErrors.nombreCategoria = 'El nombre de la categoría es obligatorio';
    } else if (formData.nombreCategoria.trim().length < 3) {
      newErrors.nombreCategoria = 'El nombre debe contener al menos 3 caracteres';
    }

    if (!formData.descripcionCategoria.trim()) {
      newErrors.descripcionCategoria = 'La descripción es obligatoria';
    } else if (formData.descripcionCategoria.trim().length < 5) {
      newErrors.descripcionCategoria = 'La descripción debe contener al menos 5 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isEditing) {
        response = await categoryService.updateCategory(category.idCategoriaProducto, formData);
      } else {
        response = await categoryService.createCategory(formData);
      }

      if (response.success) {
        onSave(response.data, isEditing ? 'updated' : 'created');
      } else if (response.error?.response?.data?.errors) {
        setErrors(response.error.response.data.errors);
      } else {
        alert(response.message || 'Ocurrió un error al guardar la categoría');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Ocurrió un error inesperado al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M9 3v2m6-2v2M4 9h16l-1 12H5L4 9z" />
              </svg>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing ? 'Actualiza la información de la categoría seleccionada' : 'Completa la información para crear una nueva categoría'}
                </p>
              </div>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div>
            <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              id="nombreCategoria"
              name="nombreCategoria"
              value={formData.nombreCategoria}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.nombreCategoria ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Útiles escolares"
            />
            {errors.nombreCategoria && (
              <p className="mt-1 text-sm text-red-600">{errors.nombreCategoria}</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcionCategoria" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="descripcionCategoria"
              name="descripcionCategoria"
              value={formData.descripcionCategoria}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.descripcionCategoria ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe los productos incluidos en esta categoría"
            />
            {errors.descripcionCategoria && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcionCategoria}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="estadoCategoria"
              name="estadoCategoria"
              checked={formData.estadoCategoria}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="estadoCategoria" className="ml-2 block text-sm text-gray-700">
              Categoría activa
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Actualizando...' : 'Guardando...'}
                </div>
              ) : (
                isEditing ? 'Actualizar Categoría' : 'Crear Categoría'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
