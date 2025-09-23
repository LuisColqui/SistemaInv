import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const EmpresaConfig = () => {
  const [empresa, setEmpresa] = useState({
    nombreEmpresa: '',
    direccionEmpresa: '',
    telefonoEmpresa: '',
    emailEmpresa: '',
    rucEmpresa: '',
    estadoEmpresa: true
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar datos actuales de la empresa
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.empresa) {
      setEmpresa({
        nombreEmpresa: currentUser.empresa.nombreEmpresa || '',
        direccionEmpresa: currentUser.empresa.direccionEmpresa || '',
        telefonoEmpresa: currentUser.empresa.telefonoEmpresa || '',
        emailEmpresa: currentUser.empresa.emailEmpresa || '',
        rucEmpresa: currentUser.empresa.rucEmpresa || '',
        estadoEmpresa: currentUser.empresa.estadoEmpresa !== undefined ? currentUser.empresa.estadoEmpresa : true
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!empresa.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = 'El nombre de la empresa es requerido';
    }

    if (!empresa.direccionEmpresa.trim()) {
      newErrors.direccionEmpresa = 'La dirección es requerida';
    }

    if (!empresa.telefonoEmpresa.trim()) {
      newErrors.telefonoEmpresa = 'El teléfono es requerido';
    } else if (!/^\d{9,15}$/.test(empresa.telefonoEmpresa)) {
      newErrors.telefonoEmpresa = 'El teléfono debe tener entre 9 y 15 dígitos';
    }

    if (!empresa.emailEmpresa.trim()) {
      newErrors.emailEmpresa = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.emailEmpresa)) {
      newErrors.emailEmpresa = 'El email no tiene un formato válido';
    }

    if (!empresa.rucEmpresa.trim()) {
      newErrors.rucEmpresa = 'El RUC es requerido';
    } else if (!/^\d{11}$/.test(empresa.rucEmpresa)) {
      newErrors.rucEmpresa = 'El RUC debe tener exactamente 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmpresa(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
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

    setLoading(true);
    setMessage(null);

    try {
      await authService.updateEmpresa(empresa);
      setMessage({
        type: 'success',
        text: 'Datos de la empresa actualizados correctamente'
      });
    } catch (error) {
      let errorMessage = 'Error al actualizar los datos de la empresa';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Configuración de la Empresa
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Actualiza la información de tu empresa
              </p>
            </div>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="px-6 py-6">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de la empresa */}
              <div>
                <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  id="nombreEmpresa"
                  name="nombreEmpresa"
                  value={empresa.nombreEmpresa}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.nombreEmpresa ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el nombre de la empresa"
                />
                {errors.nombreEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombreEmpresa}</p>
                )}
              </div>

              {/* RUC */}
              <div>
                <label htmlFor="rucEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                  RUC *
                </label>
                <input
                  type="text"
                  id="rucEmpresa"
                  name="rucEmpresa"
                  value={empresa.rucEmpresa}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.rucEmpresa ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el RUC de la empresa"
                  maxLength="11"
                />
                {errors.rucEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errors.rucEmpresa}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="emailEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Corporativo *
                </label>
                <input
                  type="email"
                  id="emailEmpresa"
                  name="emailEmpresa"
                  value={empresa.emailEmpresa}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.emailEmpresa ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="contacto@empresa.com"
                />
                {errors.emailEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errors.emailEmpresa}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefonoEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefonoEmpresa"
                  name="telefonoEmpresa"
                  value={empresa.telefonoEmpresa}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.telefonoEmpresa ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="987654321"
                />
                {errors.telefonoEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefonoEmpresa}</p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="direccionEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <textarea
                id="direccionEmpresa"
                name="direccionEmpresa"
                value={empresa.direccionEmpresa}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.direccionEmpresa ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Av. Principal 123, Distrito, Provincia, Departamento"
              />
              {errors.direccionEmpresa && (
                <p className="mt-1 text-sm text-red-600">{errors.direccionEmpresa}</p>
              )}
            </div>

            {/* Estado de la empresa */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="estadoEmpresa"
                name="estadoEmpresa"
                checked={empresa.estadoEmpresa}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="estadoEmpresa" className="ml-2 block text-sm text-gray-700">
                Empresa activa
              </label>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  // Recargar datos originales
                  const currentUser = authService.getCurrentUser();
                  if (currentUser && currentUser.empresa) {
                    setEmpresa({
                      nombreEmpresa: currentUser.empresa.nombreEmpresa || '',
                      direccionEmpresa: currentUser.empresa.direccionEmpresa || '',
                      telefonoEmpresa: currentUser.empresa.telefonoEmpresa || '',
                      emailEmpresa: currentUser.empresa.emailEmpresa || '',
                      rucEmpresa: currentUser.empresa.rucEmpresa || '',
                      estadoEmpresa: currentUser.empresa.estadoEmpresa !== undefined ? currentUser.empresa.estadoEmpresa : true
                    });
                  }
                  setErrors({});
                  setMessage(null);
                }}
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
                    Guardando...
                  </div>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmpresaConfig;