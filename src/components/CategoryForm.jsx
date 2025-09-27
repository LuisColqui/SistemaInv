import React, { useState } from 'react';
import categoryService from '../services/categoryService';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Field, Label, Input, Textarea, HelperText } from './ui/Input';

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreCategoria: '',
    descripcionCategoria: '',
    estadoCategoria: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEditing = !!category;

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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
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
      <Card>
        <CardHeader
          title={isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          description={isEditing ? 'Actualiza la información de la categoría seleccionada' : 'Completa la información para crear una nueva categoría'}
          icon={() => (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M9 3v2m6-2v2M4 9h16l-1 12H5L4 9z" />
            </svg>
          )}
          actions={
            <Button variant="ghost" size="sm" onClick={onCancel} title="Cerrar">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          }
        />
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-6">
            <Field>
              <Label htmlFor="nombreCategoria" required>Nombre de la Categoría</Label>
              <Input
                id="nombreCategoria"
                name="nombreCategoria"
                value={formData.nombreCategoria}
                onChange={handleChange}
                placeholder="Ej: Útiles escolares"
                aria-invalid={!!errors.nombreCategoria}
              />
              <HelperText state={errors.nombreCategoria && 'error'}>
                {errors.nombreCategoria || 'Debe contener al menos 3 caracteres.'}
              </HelperText>
            </Field>

            <Field>
              <Label htmlFor="descripcionCategoria" required>Descripción</Label>
              <Textarea
                id="descripcionCategoria"
                name="descripcionCategoria"
                value={formData.descripcionCategoria}
                onChange={handleChange}
                placeholder="Describe los productos incluidos en esta categoría"
                aria-invalid={!!errors.descripcionCategoria}
              />
              <HelperText state={errors.descripcionCategoria && 'error'}>
                {errors.descripcionCategoria || 'Debe contener al menos 5 caracteres.'}
              </HelperText>
            </Field>

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="estadoCategoria"
                name="estadoCategoria"
                checked={formData.estadoCategoria}
                onChange={handleChange}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
              />
              <label htmlFor="estadoCategoria" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Categoría activa
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="min-w-[110px]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="min-w-[170px]"
            >
              {isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CategoryForm;

