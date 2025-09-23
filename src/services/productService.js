import api from './authService';
import { authService } from './authService';

// Servicio para la gestión de productos
export const productService = {
  // Crear un nuevo producto
  createProduct: async (productData) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      // Agregar el ID de la empresa del usuario actual
      const dataWithEmpresa = {
        ...productData,
        idEmpresa: currentUser?.empresa?.idEmpresa || 1
      };

      const response = await api.post('/productos', dataWithEmpresa);
      return {
        success: true,
        data: response.data,
        message: 'Producto creado correctamente'
      };
    } catch (error) {
      console.error('Error al crear producto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear el producto',
        error
      };
    }
  },

  // Obtener todos los productos
  getProducts: async (filters = {}) => {
    try {
      let url = '/productos';
      const queryParams = [];

      // Agregar filtros si existen
      if (filters.search) {
        queryParams.push(`search=${encodeURIComponent(filters.search)}`);
      }
      if (filters.categoria) {
        queryParams.push(`categoria=${encodeURIComponent(filters.categoria)}`);
      }
      if (filters.estado !== undefined) {
        queryParams.push(`estado=${filters.estado}`);
      }
      if (filters.page) {
        queryParams.push(`page=${filters.page}`);
      }
      if (filters.limit) {
        queryParams.push(`limit=${filters.limit}`);
      }

      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }

      const response = await api.get(url);
      return {
        success: true,
        data: response.data,
        message: 'Productos obtenidos correctamente'
      };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener los productos',
        error
      };
    }
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Producto obtenido correctamente'
      };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el producto',
        error
      };
    }
  },

  // Actualizar un producto
  updateProduct: async (id, productData) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      // Agregar el ID de la empresa del usuario actual
      const dataWithEmpresa = {
        ...productData,
        idEmpresa: currentUser?.empresa?.idEmpresa || 1
      };

      const response = await api.put(`/productos/${id}`, dataWithEmpresa);
      return {
        success: true,
        data: response.data,
        message: 'Producto actualizado correctamente'
      };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar el producto',
        error
      };
    }
  },

  // Eliminar un producto
  deleteProduct: async (id) => {
    try {
      await api.delete(`/productos/${id}`);
      return {
        success: true,
        message: 'Producto eliminado correctamente'
      };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar el producto',
        error
      };
    }
  },

  // Obtener categorías únicas de productos
  getCategories: async () => {
    try {
      const response = await api.get('/productos/categorias');
      return {
        success: true,
        data: response.data,
        message: 'Categorías obtenidas correctamente'
      };
    } catch (firstError) {
      // Si no existe endpoint específico para categorías, extraemos de productos
      console.error('Error en endpoint de categorías:', firstError);
      try {
        const productsResponse = await api.get('/productos');
        const categories = [...new Set(productsResponse.data.map(p => p.categoriaProducto))];
        return {
          success: true,
          data: categories,
          message: 'Categorías obtenidas correctamente'
        };
      } catch (fallbackError) {
        console.error('Error al obtener categorías:', fallbackError);
        return {
          success: false,
          message: 'Error al obtener las categorías',
          error: fallbackError
        };
      }
    }
  },

  // Validar código de producto único
  validateProductCode: async (code, excludeId = null) => {
    try {
      const response = await api.get(`/productos/validate-code/${code}`);
      return {
        success: true,
        isValid: !response.data.exists || response.data.productId === excludeId,
        message: response.data.exists ? 'Código ya existe' : 'Código disponible'
      };
    } catch (validationError) {
      // Si no existe endpoint de validación, usar método alternativo
      console.error('Error en validación de código:', validationError);
      try {
        const productsResponse = await api.get('/productos');
        const existingProduct = productsResponse.data.find(p => 
          p.codigoProducto === code && (excludeId === null || p.idProducto !== excludeId)
        );
        return {
          success: true,
          isValid: !existingProduct,
          message: existingProduct ? 'Código ya existe' : 'Código disponible'
        };
      } catch (fallbackError) {
        return {
          success: false,
          message: 'Error al validar el código',
          error: fallbackError
        };
      }
    }
  }
};

export default productService;