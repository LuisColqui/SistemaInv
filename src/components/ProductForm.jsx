import React, { useState, useEffect, useRef } from 'react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { Field, Label, Input, Textarea, HelperText, inputBase } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';

// ProductForm
// Props:
//  - product: objeto existente para edición
//  - onSave(data, action): callback tras guardar (action: 'created' | 'updated')
//  - onCancel(): cancelar
//  - embedded: si true se muestra sin Card/Header porque va dentro de un Modal que ya provee título
//  - showActions: permite ocultar los botones si se gestionarán externamente (futuro)
const ProductForm = ({ product, onSave, onCancel, embedded = true, showActions = true, formId = 'product-form', onDirtyChange }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    nombreProducto: '',
    descripcionProducto: '',
    precioVentaProducto: '',
    precioCompraProducto: '',
    stockProducto: '',
    codigoProducto: '',
    idCategoriaProducto: '',
    unidadMedidaProducto: 'unidad',
    estadoProducto: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [pendingCategoryName, setPendingCategoryName] = useState('');
  const [initialSnapshot, setInitialSnapshot] = useState(null);

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
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const response = await categoryService.getCategoriesByEmpresa();
        if (response.success) {
          const rawCategories = Array.isArray(response.data) ? response.data : [];
          const activeCategories = rawCategories.filter(cat => cat.estadoCategoria !== false);
          setCategories(activeCategories);
        } else {
          setCategories([]);
          setCategoriesError(response.message || 'No se pudieron cargar las categorías');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
        setCategoriesError('Error al cargar las categorías');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!pendingCategoryName || formData.idCategoriaProducto || !categories.length) {
      return;
    }

    const matchedCategory = categories.find(cat => {
      const categoryName = cat?.nombreCategoriaProducto || cat?.nombreCategoria || '';
      return categoryName.toLowerCase() === pendingCategoryName.toLowerCase();
    });

    if (matchedCategory) {
      setFormData(prev => ({
        ...prev,
        idCategoriaProducto: String(matchedCategory.idCategoriaProducto)
      }));
      setPendingCategoryName('');
    }
  }, [pendingCategoryName, categories, formData.idCategoriaProducto]);

  useEffect(() => {
    if (product) {
      setIsEditing(true);
      const resolvedCategoryId = product.idCategoriaProducto ?? product?.categoriaProducto?.idCategoriaProducto ?? '';
      const resolvedCategoryName =
        product?.categoriaProducto?.nombreCategoriaProducto ??
        product?.categoriaProductoNombre ??
        (typeof product?.categoriaProducto === 'string' ? product.categoriaProducto : '');

      setFormData({
        nombreProducto: product.nombreProducto || '',
        descripcionProducto: product.descripcionProducto || '',
        precioVentaProducto: product.precioVentaProducto || '',
        precioCompraProducto: product.precioCompraProducto || '',
        stockProducto: product.stockProducto || '',
        codigoProducto: product.codigoProducto || '',
        idCategoriaProducto: resolvedCategoryId ? String(resolvedCategoryId) : '',
        unidadMedidaProducto: product.unidadMedidaProducto || 'unidad',
        estadoProducto: product.estadoProducto !== undefined ? product.estadoProducto : true
      });
      setPendingCategoryName(resolvedCategoryName || '');
      setInitialSnapshot({
        nombreProducto: product.nombreProducto || '',
        descripcionProducto: product.descripcionProducto || '',
        precioVentaProducto: product.precioVentaProducto || '',
        precioCompraProducto: product.precioCompraProducto || '',
        stockProducto: product.stockProducto || '',
        codigoProducto: product.codigoProducto || '',
        idCategoriaProducto: resolvedCategoryId ? String(resolvedCategoryId) : '',
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
        idCategoriaProducto: '',
        unidadMedidaProducto: 'unidad',
        estadoProducto: true
      });
      setPendingCategoryName('');
      setInitialSnapshot({
        nombreProducto: '',
        descripcionProducto: '',
        precioVentaProducto: '',
        precioCompraProducto: '',
        stockProducto: '',
        codigoProducto: '',
        idCategoriaProducto: '',
        unidadMedidaProducto: 'unidad',
        estadoProducto: true
      });
    }
  }, [product]);

  // Dirty state detection
  useEffect(() => {
    if (!initialSnapshot) return;
    const isDirty = Object.keys(initialSnapshot).some(key => String(formData[key]) !== String(initialSnapshot[key]));
    onDirtyChange && onDirtyChange(isDirty);
  }, [formData, initialSnapshot, onDirtyChange]);

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
    if (!formData.idCategoriaProducto) {
      newErrors.idCategoriaProducto = 'La categoría es requerida';
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
        stockProducto: parseInt(formData.stockProducto),
        idCategoriaProducto: formData.idCategoriaProducto
          ? parseInt(formData.idCategoriaProducto, 10)
          : null
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

  // Layout Helpers
  const BasicInfo = (
    <div className="space-y-6">
      <div>
        {!embedded && <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h3>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field>
            <Label htmlFor="nombreProducto" required>Nombre del Producto</Label>
            <Input
              id="nombreProducto"
              name="nombreProducto"
              placeholder="Ej: Laptop HP Pavilion"
              value={formData.nombreProducto}
              onChange={handleChange}
              aria-invalid={!!errors.nombreProducto}
            />
            <HelperText state={errors.nombreProducto && 'error'}>{errors.nombreProducto}</HelperText>
          </Field>
          <Field>
            <Label htmlFor="codigoProducto" required>Código del Producto</Label>
            <Input
              id="codigoProducto"
              name="codigoProducto"
              maxLength={10}
              placeholder="Ej: LAP001"
              value={formData.codigoProducto}
              onChange={handleChange}
              aria-invalid={!!errors.codigoProducto}
            />
            <HelperText state={errors.codigoProducto && 'error'}>
              {errors.codigoProducto || 'Solo letras mayúsculas y números (3-10 caracteres)'}
            </HelperText>
          </Field>
          <Field>
            <Label htmlFor="idCategoriaProducto" required>Categoría</Label>
            <select
              id="idCategoriaProducto"
              name="idCategoriaProducto"
              value={formData.idCategoriaProducto}
              onChange={handleChange}
              disabled={categoriesLoading || categories.length === 0}
              className={`${inputBase} ${categoriesLoading ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''} ${errors.idCategoriaProducto ? 'border-danger-500' : ''}`}
              aria-invalid={!!errors.idCategoriaProducto}
            >
              <option value="">
                {categoriesLoading
                  ? 'Cargando categorías...'
                  : categories.length === 0
                    ? 'No hay categorías disponibles'
                    : 'Selecciona una categoría'}
              </option>
              {categories.map(category => (
                <option key={category.idCategoriaProducto} value={String(category.idCategoriaProducto)}>
                  {category.nombreCategoriaProducto || category.nombreCategoria}
                </option>
              ))}
            </select>
            <HelperText state={errors.idCategoriaProducto && 'error'}>
              {errors.idCategoriaProducto || (categoriesError && !errors.idCategoriaProducto ? categoriesError : '')}
            </HelperText>
          </Field>
          <Field>
            <Label htmlFor="unidadMedidaProducto" required>Unidad de Medida</Label>
            <select
              id="unidadMedidaProducto"
              name="unidadMedidaProducto"
              value={formData.unidadMedidaProducto}
              onChange={handleChange}
              className={`${inputBase} ${errors.unidadMedidaProducto ? 'border-danger-500' : ''}`}
              aria-invalid={!!errors.unidadMedidaProducto}
            >
              {unidadesMedida.map(unidad => (
                <option key={unidad} value={unidad}>{unidad.charAt(0).toUpperCase() + unidad.slice(1)}</option>
              ))}
            </select>
            <HelperText state={errors.unidadMedidaProducto && 'error'}>{errors.unidadMedidaProducto}</HelperText>
          </Field>
        </div>
      </div>
    </div>
  );

  const Description = (
    <Field>
      <Label htmlFor="descripcionProducto" required>Descripción</Label>
      <Textarea
        id="descripcionProducto"
        name="descripcionProducto"
        rows={3}
        placeholder="Describe las características principales..."
        value={formData.descripcionProducto}
        onChange={handleChange}
        aria-invalid={!!errors.descripcionProducto}
      />
      <HelperText state={errors.descripcionProducto && 'error'}>{errors.descripcionProducto}</HelperText>
    </Field>
  );

  const Pricing = (
    <div className="space-y-4">
      {!embedded && <h3 className="text-base font-semibold text-gray-900 dark:text-white">Precios e Inventario</h3>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field>
          <Label htmlFor="precioCompraProducto" required>Precio de Compra</Label>
          <div className="relative">
            <span className="absolute left-3 top-1.5 text-gray-500 dark:text-gray-400 text-sm">S/</span>
            <Input
              id="precioCompraProducto"
              name="precioCompraProducto"
              placeholder="0.00"
              value={formData.precioCompraProducto}
              onChange={handleChange}
              className="pl-7"
              aria-invalid={!!errors.precioCompraProducto}
            />
          </div>
          <HelperText state={errors.precioCompraProducto && 'error'}>{errors.precioCompraProducto}</HelperText>
        </Field>
        <Field>
          <Label htmlFor="precioVentaProducto" required>Precio de Venta</Label>
          <div className="relative">
            <span className="absolute left-3 top-1.5 text-gray-500 dark:text-gray-400 text-sm">S/</span>
            <Input
              id="precioVentaProducto"
              name="precioVentaProducto"
              placeholder="0.00"
              value={formData.precioVentaProducto}
              onChange={handleChange}
              className="pl-7"
              aria-invalid={!!errors.precioVentaProducto}
            />
          </div>
          <HelperText state={errors.precioVentaProducto && 'error'}>{errors.precioVentaProducto}</HelperText>
        </Field>
        <Field>
          <Label htmlFor="stockProducto" required>Stock Inicial</Label>
          <Input
            id="stockProducto"
            name="stockProducto"
            placeholder="0"
            value={formData.stockProducto}
            onChange={handleChange}
            aria-invalid={!!errors.stockProducto}
          />
          <HelperText state={errors.stockProducto && 'error'}>{errors.stockProducto}</HelperText>
        </Field>
      </div>
    </div>
  );

  const Status = (
    <div className="flex items-center gap-2 pt-2">
      <input
        type="checkbox"
        id="estadoProducto"
        name="estadoProducto"
        checked={formData.estadoProducto}
        onChange={handleChange}
        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
      />
      <Label htmlFor="estadoProducto" className="!mb-0 font-normal">Producto activo</Label>
    </div>
  );

  const Actions = showActions && (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      <Button type="submit" variant="primary" loading={loading} disabled={loading}>
        {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
      </Button>
    </div>
  );

  const FormInner = (
    <form id={formId} ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {BasicInfo}
      {Description}
      {Pricing}
      {Status}
      {Actions}
    </form>
  );

  if (embedded) {
    return <div className="max-w-5xl mx-auto">{FormInner}</div>;
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader
        title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        description={isEditing ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
      />
      <CardContent>
        {FormInner}
      </CardContent>
    </Card>
  );
};

export default ProductForm;