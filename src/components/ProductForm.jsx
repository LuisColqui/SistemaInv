import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreProducto: '',
    descripcionProducto: '',
    precioVentaProducto: '',
    precioCompraProducto: '',
    stockProducto: '',
    codigoProducto: '',
    categoriaProducto: '',
    unidadMedidaProducto: 'unidad',
    estadoProducto: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Unidades de medida predefinidas
  const unidadesMedida = [
    'unidad',
    'kilogramo',
    'gramo',
    'litro',
    'mililitro',
    'metro',
    'centímetro',
    'pieza',
    'caja',
    'paquete',
    'docena'
  ];

  useEffect(() => {
    if (product) {
      setIsEditing(true);
      setFormData({
        nombreProducto: product.nombreProducto || '',
        descripcionProducto: product.descripcionProducto || '',
        precioVentaProducto: product.precioVentaProducto || '',
        precioCompraProducto: product.precioCompraProducto || '',
        stockProducto: product.stockProducto || '',
        codigoProducto: product.codigoProducto || '',
        categoriaProducto: product.categoriaProducto || '',
        unidadMedidaProducto: product.unidadMedidaProducto || 'unidad',
        estadoProducto: product.estadoProducto !== undefined ? product.estadoProducto : true
      });
    } else {
      setIsEditing(false);
      setFormData({
        nombreProducto: '',
        descripcionProducto: '',
        precioVentaProducto: '',
        precioCompraProducto: '',
        stockProducto: '',
        codigoProducto: '',
        categoriaProducto: '',
        unidadMedidaProducto: 'unidad',
        estadoProducto: true
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombreProducto.trim()) {
      newErrors.nombreProducto = 'El nombre del producto es requerido';
    } else if (formData.nombreProducto.trim().length < 3) {
      newErrors.nombreProducto = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar código
    if (!formData.codigoProducto.trim()) {
      newErrors.codigoProducto = 'El código del producto es requerido';
    } else if (!/^[A-Z0-9]{3,10}$/.test(formData.codigoProducto)) {
      newErrors.codigoProducto = 'El código debe tener entre 3-10 caracteres alfanuméricos en mayúsculas';
    }

    // Validar descripción
    if (!formData.descripcionProducto.trim()) {
      newErrors.descripcionProducto = 'La descripción es requerida';
    }

    // Validar categoría
    if (!formData.categoriaProducto.trim()) {
      newErrors.categoriaProducto = 'La categoría es requerida';
    }

    // Validar precio de compra
    const precioCompra = parseFloat(formData.precioCompraProducto);
    if (!formData.precioCompraProducto || isNaN(precioCompra) || precioCompra <= 0) {
      newErrors.precioCompraProducto = 'El precio de compra debe ser un número mayor a 0';
    }

    // Validar precio de venta
    const precioVenta = parseFloat(formData.precioVentaProducto);
    if (!formData.precioVentaProducto || isNaN(precioVenta) || precioVenta <= 0) {
      newErrors.precioVentaProducto = 'El precio de venta debe ser un número mayor a 0';
    } else if (precioVenta <= precioCompra && !newErrors.precioCompraProducto) {
      newErrors.precioVentaProducto = 'El precio de venta debe ser mayor al precio de compra';
    }

    // Validar stock
    const stock = parseInt(formData.stockProducto);
    if (!formData.stockProducto || isNaN(stock) || stock < 0) {
      newErrors.stockProducto = 'El stock debe ser un número mayor o igual a 0';
    }

    // Validar unidad de medida
    if (!formData.unidadMedidaProducto) {
      newErrors.unidadMedidaProducto = 'La unidad de medida es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    // Procesar valores específicos
    if (name === 'codigoProducto') {
      processedValue = value.toUpperCase();
    } else if (name === 'precioVentaProducto' || name === 'precioCompraProducto') {
      // Permitir solo números y un punto decimal
      processedValue = value.replace(/[^0-9.]/g, '');
      // Evitar múltiples puntos decimales
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else if (name === 'stockProducto') {
      // Permitir solo números enteros
      processedValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    // Limpiar errores cuando el usuario empiece a corregir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Validar código único (solo para productos nuevos o cuando el código cambió)
    const shouldValidateCode = !isEditing || (product && product.codigoProducto !== formData.codigoProducto);
    if (shouldValidateCode) {
      try {
        const codeValidation = await productService.validateProductCode(
          formData.codigoProducto,
          isEditing ? product.idProducto : null
        );
        
        if (!codeValidation.success || !codeValidation.isValid) {
          setErrors(prev => ({
            ...prev,
            codigoProducto: 'Este código ya está en uso'
          }));
          return;
        }
      } catch (error) {
        console.error('Error validating code:', error);
      }
    }

    setLoading(true);

    try {
      // Preparar datos para envío
      const dataToSend = {
        ...formData,
        precioVentaProducto: parseFloat(formData.precioVentaProducto),
        precioCompraProducto: parseFloat(formData.precioCompraProducto),
        stockProducto: parseInt(formData.stockProducto)
      };

      let response;
      if (isEditing) {
        response = await productService.updateProduct(product.idProducto, dataToSend);
      } else {
        response = await productService.createProduct(dataToSend);
      }

      if (response.success) {
        onSave(response.data, isEditing ? 'updated' : 'created');
      } else {
        // Mostrar errores del servidor
        if (response.error?.response?.data?.errors) {
          setErrors(response.error.response.data.errors);
        } else {
          alert('Error: ' + response.message);
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="space-y-6">
            {/* Información básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre del producto */}
                <div>
                  <label htmlFor="nombreProducto" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    id="nombreProducto"
                    name="nombreProducto"
                    value={formData.nombreProducto}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.nombreProducto ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Laptop HP Pavilion"
                  />
                  {errors.nombreProducto && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombreProducto}</p>
                  )}
                </div>

                {/* Código del producto */}
                <div>
                  <label htmlFor="codigoProducto" className="block text-sm font-medium text-gray-700 mb-2">
                    Código del Producto *
                  </label>
                  <input
                    type="text"
                    id="codigoProducto"
                    name="codigoProducto"
                    value={formData.codigoProducto}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.codigoProducto ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ej: LAP001"
                    maxLength="10"
                  />
                  {errors.codigoProducto && (
                    <p className="mt-1 text-sm text-red-600">{errors.codigoProducto}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Solo letras mayúsculas y números (3-10 caracteres)
                  </p>
                </div>

                {/* Categoría */}
                <div>
                  <label htmlFor="categoriaProducto" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <input
                    type="text"
                    id="categoriaProducto"
                    name="categoriaProducto"
                    value={formData.categoriaProducto}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.categoriaProducto ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Electrónicos"
                  />
                  {errors.categoriaProducto && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoriaProducto}</p>
                  )}
                </div>

                {/* Unidad de medida */}
                <div>
                  <label htmlFor="unidadMedidaProducto" className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Medida *
                  </label>
                  <select
                    id="unidadMedidaProducto"
                    name="unidadMedidaProducto"
                    value={formData.unidadMedidaProducto}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.unidadMedidaProducto ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    {unidadesMedida.map(unidad => (
                      <option key={unidad} value={unidad}>
                        {unidad.charAt(0).toUpperCase() + unidad.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.unidadMedidaProducto && (
                    <p className="mt-1 text-sm text-red-600">{errors.unidadMedidaProducto}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcionProducto" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="descripcionProducto"
                name="descripcionProducto"
                value={formData.descripcionProducto}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.descripcionProducto ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe las características principales del producto..."
              />
              {errors.descripcionProducto && (
                <p className="mt-1 text-sm text-red-600">{errors.descripcionProducto}</p>
              )}
            </div>

            {/* Precios y Stock */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Precios e Inventario</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Precio de compra */}
                <div>
                  <label htmlFor="precioCompraProducto" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Compra *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">S/</span>
                    <input
                      type="text"
                      id="precioCompraProducto"
                      name="precioCompraProducto"
                      value={formData.precioCompraProducto}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.precioCompraProducto ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.precioCompraProducto && (
                    <p className="mt-1 text-sm text-red-600">{errors.precioCompraProducto}</p>
                  )}
                </div>

                {/* Precio de venta */}
                <div>
                  <label htmlFor="precioVentaProducto" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Venta *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">S/</span>
                    <input
                      type="text"
                      id="precioVentaProducto"
                      name="precioVentaProducto"
                      value={formData.precioVentaProducto}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.precioVentaProducto ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.precioVentaProducto && (
                    <p className="mt-1 text-sm text-red-600">{errors.precioVentaProducto}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="stockProducto" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Inicial *
                  </label>
                  <input
                    type="text"
                    id="stockProducto"
                    name="stockProducto"
                    value={formData.stockProducto}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.stockProducto ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stockProducto && (
                    <p className="mt-1 text-sm text-red-600">{errors.stockProducto}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Estado del producto */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="estadoProducto"
                name="estadoProducto"
                checked={formData.estadoProducto}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="estadoProducto" className="ml-2 block text-sm text-gray-700">
                Producto activo
              </label>
            </div>

            {/* Botones de acción */}
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
                  isEditing ? 'Actualizar Producto' : 'Crear Producto'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;