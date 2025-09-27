import api, { authService } from './authService';

// Servicio para la gestión de categorías de producto
export const categoryService = {
  // Crear una nueva categoría
  createCategory: async (categoryData) => {
    try {
      const currentUser = authService.getCurrentUser();
      const payload = {
        ...categoryData,
        idEmpresa: currentUser?.empresa?.idEmpresa || categoryData.idEmpresa
      };

      const response = await api.post('/categorias-producto', payload);
      return {
        success: true,
        data: response.data,
        message: 'Categoría creada correctamente'
      };
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear la categoría',
        error
      };
    }
  },

  // Actualizar una categoría existente
  updateCategory: async (idCategoriaProducto, categoryData) => {
    try {
      const currentUser = authService.getCurrentUser();
      const payload = {
        ...categoryData,
        idEmpresa: currentUser?.empresa?.idEmpresa || categoryData.idEmpresa
      };

      const response = await api.put(`/categorias-producto/${idCategoriaProducto}`, payload);
      return {
        success: true,
        data: response.data,
        message: 'Categoría actualizada correctamente'
      };
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar la categoría',
        error
      };
    }
  },

  // Obtener una categoría por su ID
  getCategoryById: async (idCategoriaProducto) => {
    try {
      const response = await api.get(`/categorias-producto/${idCategoriaProducto}`);
      return {
        success: true,
        data: response.data,
        message: 'Categoría obtenida correctamente'
      };
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener la categoría',
        error
      };
    }
  },

  // Obtener categorías por empresa
  getCategoriesByEmpresa: async (idEmpresaParam) => {
    try {
      const currentUser = authService.getCurrentUser();
      const idEmpresa = idEmpresaParam || currentUser?.empresa?.idEmpresa;
      if (!idEmpresa) {
        throw new Error('No se encontró un ID de empresa válido');
      }

      const response = await api.get(`/categorias-producto/empresa/${idEmpresa}`);
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [],
        message: 'Categorías obtenidas correctamente'
      };
    } catch (error) {
      console.error('Error al obtener categorías por empresa:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener las categorías',
        error
      };
    }
  },

  // Eliminar una categoría
  deleteCategory: async (idCategoriaProducto) => {
    try {
      await api.delete(`/categorias-producto/${idCategoriaProducto}`);
      return {
        success: true,
        message: 'Categoría eliminada correctamente'
      };
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar la categoría',
        error
      };
    }
  }
};

export default categoryService;
