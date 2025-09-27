import React, { useState, useEffect, useMemo, useCallback } from 'react';
import categoryService from '../services/categoryService';

const CategoryList = ({ onNewCategory, onEditCategory, refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'nombreCategoria', direction: 'asc' });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategoriesByEmpresa();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError(response.message);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Error al cargar las categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories, refreshTrigger]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      estado: ''
    });
  };

  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((category) =>
        category.nombreCategoria?.toLowerCase().includes(searchLower) ||
        category.descripcionCategoria?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.estado !== '') {
      const estadoValue = filters.estado === 'true';
      filtered = filtered.filter((category) => category.estadoCategoria === estadoValue);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const aLower = aVal.toLowerCase();
          const bLower = bVal.toLowerCase();
          if (aLower < bLower) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aLower > bLower) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [categories, filters, sortConfig]);

  const handleSort = (columnKey) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(`¿Seguro que deseas eliminar la categoría "${category.nombreCategoria}"?`);
    if (!confirmed) return;

    try {
      const response = await categoryService.deleteCategory(category.idCategoriaProducto);
      if (response.success) {
        loadCategories();
      } else {
        alert(response.message || 'Error al eliminar la categoría');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Error al eliminar la categoría');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M9 3v2m6-2v2M4 9h16l-1 12H5L4 9z" />
            </svg>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Categorías de Productos</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredCategories.length} categoría{filteredCategories.length !== 1 ? 's' : ''} encontrada{filteredCategories.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onNewCategory}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ease-in-out flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Nombre o descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={loadCategories}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Aplicar
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-6 py-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M9 3v2m6-2v2M4 9h16l-1 12H5L4 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías registradas</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando tu primera categoría.</p>
            <div className="mt-6">
              <button
                onClick={onNewCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Categoría
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('nombreCategoria')}
                  >
                    <div className="flex items-center">
                      Nombre {getSortIcon('nombreCategoria')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('estadoCategoria')}
                  >
                    <div className="flex items-center">
                      Estado {getSortIcon('estadoCategoria')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.idCategoriaProducto} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.nombreCategoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.descripcionCategoria || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.estadoCategoria ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.estadoCategoria ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEditCategory(category)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Editar categoría"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar categoría"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
