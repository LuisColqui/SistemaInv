import axios from 'axios';

// URL base de la API
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio de autenticación
export const authService = {
  // Función para hacer login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        correo: credentials.correo,
        contrasena: credentials.contrasena
      });

      // Si la autenticación es exitosa, guardar el token
      if (response.data.status === 200 && response.data.data && response.data.data.length > 0) {
        const userData = response.data.data[0];
        
        // Guardar datos en localStorage
        localStorage.setItem('token', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          idUsuario: userData.idUsuario,
          nombre: userData.nombre,
          apellido: userData.apellido,
          correo: userData.correo,
          tipoUsuario: userData.tipoUsuario,
          numeroDocumento: userData.numeroDocumento,
          nombreUsuario: userData.nombreUsuario,
          apellidoUsuario: userData.apellidoUsuario,
          correoUsuario: userData.correoUsuario,
          empresa: userData.empresa ? {
            idEmpresa: userData.empresa.idEmpresa,
            nombreEmpresa: userData.empresa.nombreEmpresa,
            direccionEmpresa: userData.empresa.direccionEmpresa,
            telefonoEmpresa: userData.empresa.telefonoEmpresa,
            emailEmpresa: userData.empresa.emailEmpresa,
            rucEmpresa: userData.empresa.rucEmpresa,
            estadoEmpresa: userData.empresa.estadoEmpresa
          } : null
        }));

        return {
          success: true,
          message: response.data.message,
          user: userData
        };
      }
      
      return {
        success: false,
        message: 'Error en la respuesta del servidor'
      };

    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error de respuesta del servidor
        return {
          success: false,
          message: error.response.data?.message || 'Credenciales incorrectas'
        };
      } else if (error.request) {
        // Error de red
        return {
          success: false,
          message: 'Error de conexión. Verifique que el servidor esté ejecutándose.'
        };
      } else {
        // Otro tipo de error
        return {
          success: false,
          message: 'Error inesperado. Intente nuevamente.'
        };
      }
    }
  },

  // Función para cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Función para obtener el token actual
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Función para verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return token !== null;
  },

  // Función para obtener los datos del usuario
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Función para obtener todas las empresas
  getEmpresas: async () => {
    try {
      const response = await api.get('/empresas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      throw error;
    }
  },

  // Función para actualizar datos de empresa
  updateEmpresa: async (empresaData) => {
    try {
      const response = await api.post('/empresas', empresaData);
      
      // Actualizar los datos del usuario en localStorage si la empresa fue actualizada
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.empresa && response.data) {
        const updatedUser = {
          ...currentUser,
          empresa: {
            ...currentUser.empresa,
            ...response.data
          }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      throw error;
    }
  }
};

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;