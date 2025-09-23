# Sistema de Inventarios - Frontend

Este es el frontend del Sistema de Inventarios desarrollado en **React** con **TailwindCSS**.

## 🚀 Características

- ✅ Interfaz moderna y responsiva con TailwindCSS
- ✅ Autenticación con JWT tokens
- ✅ Manejo de estado con React hooks
- ✅ Validación de formularios
- ✅ Navegación con React Router
- ✅ Servicios organizados para llamadas a la API

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Backend del Sistema de Inventarios ejecutándose en `http://localhost:8080`

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd SistemaInv
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── Login.jsx       # Componente de login
├── pages/              # Páginas principales
│   └── Dashboard.jsx   # Panel principal
├── services/           # Servicios para API
│   └── authService.js  # Servicio de autenticación
├── utils/              # Utilidades
├── App.jsx             # Componente raíz
└── main.jsx           # Punto de entrada
```

## 🔐 Autenticación

El sistema utiliza el endpoint de autenticación del backend:

- **URL**: `POST http://localhost:8080/api/v1/auth/login`
- **Body**:
```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "tu_contraseña"
}
```

### Credenciales de prueba
Si tu backend tiene datos de prueba, puedes usar credenciales como:
- Correo: `admin@ejemplo.com`
- Contraseña: `password123`

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para construir interfaces
- **Vite** - Herramienta de construcción rápida
- **TailwindCSS** - Framework de CSS utilitario
- **React Router DOM** - Navegación entre páginas
- **Axios** - Cliente HTTP para llamadas a la API

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción

## 📝 Funcionalidades Implementadas

### ✅ Login
- Formulario de login con validación
- Manejo de errores de autenticación
- Guardado de tokens en localStorage
- Redirección automática después del login

### ✅ Dashboard
- Información del usuario autenticado
- Botón de cerrar sesión
- Diseño responsivo

### ✅ Navegación
- Rutas protegidas
- Redirección automática según el estado de autenticación
- Manejo de rutas no encontradas

## 🔄 Próximas Funcionalidades

- [ ] Gestión de inventario
- [ ] CRUD de productos
- [ ] Reportes y estadísticas
- [ ] Gestión de usuarios
- [ ] Configuración del sistema

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes alguna pregunta:

1. Verifica que el backend esté ejecutándose en `http://localhost:8080`
2. Revisa la consola del navegador para errores
3. Verifica que todas las dependencias estén instaladas correctamente

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
