import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = ({ onEditProduct, onNewProduct, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    categoria: '',
    estado: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'nombreProducto', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProducts(filters);
      if (response.success) {
        setProducts(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.message);
        setProducts([]);
      }
    } catch (err) {
      setError('Error al cargar los productos');
      setProducts([]);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.categoria.trim()) count++;
    if (filters.estado !== '') count++;
    return count;
  }, [filters]);

  const toggleFilters = () => setShowFilters((v) => !v);

  const getProductCategoryName = (product) => {
    if (!product) return '';
    if (typeof product.categoriaProducto === 'string') return product.categoriaProducto;
    if (product.categoriaProducto?.nombreCategoriaProducto) {
      return product.categoriaProducto.nombreCategoriaProducto;
    }
    if (product.categoriaProducto?.nombreCategoria) {
      return product.categoriaProducto.nombreCategoria;
    }
    if (product.categoriaProductoNombre) {
      return product.categoriaProductoNombre;
    }
    return '';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    loadProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoria: '',
      estado: ''
    });
    setTimeout(loadProducts, 0);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'categoriaProducto') {
          aValue = getProductCategoryName(a);
          bValue = getProductCategoryName(b);
        }

        // Manejar valores numéricos
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Manejar strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${product.nombreProducto}"?`)) {
      try {
        const response = await productService.deleteProduct(product.idProducto);
        if (response.success) {
          loadProducts(); // Recargar la lista
        } else {
          alert('Error al eliminar el producto: ' + response.message);
        }
      } catch (err) {
        alert('Error al eliminar el producto');
        console.error('Error deleting product:', err);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Cargando productos...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Lista de Productos</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{products.length} {products.length === 1 ? 'producto' : 'productos'} encontrados</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFilters}
              className="inline-flex items-center px-3 h-9 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
              title="Mostrar/Ocultar filtros"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894L11 19v-5.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-1.5 min-w-[1.25rem] h-5 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={loadProducts}
              className="inline-flex items-center px-3 h-9 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
              title="Recargar"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0012.124 2.121M19 9a7 7 0 00-12.124-2.121" />
              </svg>
            </button>
            <button
              onClick={onNewProduct}
              className="inline-flex items-center px-3 h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Filtros (colapsables) */}
      {showFilters && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nombre, código o descripción..."
                className="w-full px-2.5 h-9 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
              <input
                type="text"
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                placeholder="Filtrar por categoría..."
                className="w-full px-2.5 h-9 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="w-full px-2.5 h-9 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div className="flex items-center md:justify-end space-x-2">
              <button
                onClick={applyFilters}
                className="inline-flex items-center px-3 h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
              >
                Filtrar
              </button>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 h-9 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

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

        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza agregando tu primer producto.</p>
            <div className="mt-6">
              <button
                onClick={onNewProduct}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Producto
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('codigoProducto')}
                  >
                    <div className="flex items-center">
                      Código {getSortIcon('codigoProducto')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('nombreProducto')}
                  >
                    <div className="flex items-center">
                      Producto {getSortIcon('nombreProducto')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('categoriaProducto')}
                  >
                    <div className="flex items-center">
                      Categoría {getSortIcon('categoriaProducto')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('stockProducto')}
                  >
                    <div className="flex items-center">
                      Stock {getSortIcon('stockProducto')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('precioVentaProducto')}
                  >
                    <div className="flex items-center">
                      Precio Venta {getSortIcon('precioVentaProducto')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('estadoProducto')}
                  >
                    <div className="flex items-center">
                      Estado {getSortIcon('estadoProducto')}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.idProducto} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                      {product.codigoProducto}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{product.nombreProducto}</div>
                        <div className="text-gray-500">{product.descripcionProducto}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                      {getProductCategoryName(product) || 'Sin categoría'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      <div className="text-gray-900">
                        {product.stockProducto} {product.unidadMedidaProducto}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900">
                      {formatCurrency(product.precioVentaProducto)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.estadoProducto 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.estadoProducto ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Editar producto"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar producto"
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

export default ProductList;