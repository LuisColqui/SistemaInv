# Credenciales de Ejemplo para Pruebas

## Para probar el login, puedes usar estas credenciales de ejemplo:

### Usuario de Prueba
- **Correo**: `usuario1@prueba.com`
- **Contraseña**: `Usuario1@prueba.com`

### Otros posibles usuarios
- **Correo**: `admin@sistemainv.com`
- **Contraseña**: `admin123`

## Notas importantes:

1. **Backend necesario**: Asegúrate de que tu backend esté ejecutándose en `http://localhost:8080`

2. **Endpoint de prueba**: Puedes verificar que el backend esté funcionando visitando:
   - `http://localhost:8080/api/v1/auth/login` (debería devolver un error 405 Method Not Allowed si está funcionando)

3. **Consola del navegador**: Si hay problemas con el login, revisa la consola del navegador (F12) para ver errores detallados.

4. **CORS**: Si obtienes errores de CORS, asegúrate de que tu backend permita solicitudes desde `http://localhost:5173`

## Estructura de respuesta esperada del backend:

```json
{
    "status": 200,
    "message": "Autenticación exitosa",
    "data": [
        {
            "token": "eyJhbGciOiJIUzM4NCJ9...",
            "refreshToken": "eyJhbGciOiJIUzM4NCJ9...",
            "tipo": "Bearer",
            "idUsuario": 1,
            "nombre": "usuario1",
            "apellido": "Usuario",
            "correo": "usuario1@prueba.com",
            "tipoUsuario": "ADMINISTRADOR",
            "numeroDocumento": null,
            "empresa": {
                "idEmpresa": 1,
                "nombreEmpresa": "Mi Empresa SA",
                "direccionEmpresa": "Av. Principal 123",
                "telefonoEmpresa": "987654321",
                "emailEmpresa": "contacto@miempresa.com",
                "rucEmpresa": "20123456789",
                "estadoEmpresa": true,
                "fechaCreacion": "2025-09-23T15:32:15.254487",
                "fechaActualizacion": "2025-09-23T15:32:15.254487"
            },
            "apellidoUsuario": "Usuario",
            "nombreUsuario": "usuario1",
            "correoUsuario": "usuario1@prueba.com"
        }
    ]
}
```

## Nuevas funcionalidades agregadas:

### ✅ **Información de Empresa**
- El sistema ahora guarda y muestra la información completa de la empresa
- Se visualiza en el dashboard con una tarjeta dedicada
- Incluye: nombre, RUC, dirección, teléfono, email y estado

### ✅ **Dashboard Mejorado**
- Diseño más profesional con tarjetas separadas
- Header con gradiente y logo de la empresa
- Información del usuario y empresa organizadas
- Preview de próximas funcionalidades

### ✅ **Navegación Mejorada**
- El nombre de la empresa aparece en la barra de navegación
- Información del usuario más detallada en el header