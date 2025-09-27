# Guía de Diseño del Sistema (Design System)

Esta guía documenta los tokens, componentes reutilizables, patrones y recomendaciones para mantener consistencia visual y escalabilidad en el proyecto.

## 1. Objetivos
- Consistencia visual en todos los formularios y vistas.
- Reducir duplicación de estilos usando componentes UI base.
- Facilitar dark mode y futuras temáticas.
- Mejorar accesibilidad (a11y) y estructura semántica.

## 2. Tokens (Tailwind `theme.extend`)
Definidos en `tailwind.config.js`:

### Colores principales
- `brand`: primario (interacciones principales)
- `accent`: estados positivos / énfasis
- `danger`: errores y acciones destructivas
- `warning`: alertas preventivas
- `info`: mensajes informativos

Ejemplo uso: `bg-brand-600 hover:bg-brand-700 text-white`, `text-danger-600`, `border-accent-300`.

### Tipografía
Fuentes: `Inter`, `Poppins`, `JetBrains Mono`.
Clases: `font-sans`, `font-display`, `font-mono`.

### Sombra y Bordes
- Sombras: `shadow-card`, `shadow-card-hover`.
- Radios: `rounded-md`, `rounded-lg`, `rounded-xl` (map a tokens extendidos).

### Animaciones
- `animate-fade-in`, `animate-scale-in`, `animate-slide-up-fade` (entradas suaves para modales, tooltips, etc.).

## 3. Componentes Base (`src/components/ui`)

### Button
Props clave:
- `variant`: `primary | secondary | outline | danger | ghost`
- `size`: `sm | md | lg`
- `loading`: muestra spinner y desactiva contenido.

Uso:
```jsx
<Button variant="primary" onClick={...}>Guardar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
```

### Card
Estructura de layout contenida.
```jsx
<Card>
  <CardHeader title="Título" description="Descripción opcional" />
  <CardContent>Contenido</CardContent>
  <CardFooter>Aquí acciones</CardFooter>
</Card>
```

### Input / Field System
Componentes: `Field`, `Label`, `Input`, `Textarea`, `HelperText`.
Patrón:
```jsx
<Field>
  <Label htmlFor="nombre" required>Nombre</Label>
  <Input id="nombre" name="nombre" value={...} onChange={...} />
  <HelperText state={errors.nombre && 'error'}>{errors.nombre}</HelperText>
</Field>
```
`state` soporta: `error | success | undefined`.

### Modal
Props clave:
- `open`, `onClose`
- `title`, `description`
- `size`: `sm|md|lg|xl|full`
- `fullHeight`: true para ocupar altura completa útil
- `actions`: nodo React (botones en footer)
- `bodyClassName`: clases extras al body scrollable

Ejemplo:
```jsx
<Modal open={open} onClose={close} title="Nuevo" size="lg" actions={<Button>Guardar</Button>}>
  <Formulario ... />
</Modal>
```

## 4. Patrones Adoptados
- Acciones de formulario en footer del Modal vía `form="idForm"` + `<button type="submit">` externo.
- Formularios manejan `dirty state` y el contenedor decide confirmación al cerrar.
- Derivar `isEditing` de presencia de objeto (`product`, `category`).
- Inputs controlados y normalización (upper-case códigos, numeric filter).

## 5. Migración de Formularios (Checklist)
1. Identificar formulario legacy con inputs HTML directos.
2. Reemplazar layout envolvente por `<Card>` (o `embedded` si va en Modal con título ya provisto).
3. Sustituir cada bloque label+input+error por estructura `Field + Label + Input/Textarea + HelperText`.
4. Mover botones al Modal footer (si aplica) usando `formId` y atributo `form`.
5. Añadir validaciones uniformes (función `validateForm`).
6. Implementar snapshot inicial y detección `dirty` si es editable.
7. Revisar accesibilidad: `aria-invalid`, `htmlFor`, roles.
8. Usar tokens de color (`brand`, `danger`) en lugar de clases arbitrarias.

## 6. Accesibilidad (A11y)
- Modal: tiene `role="dialog"`, `aria-modal="true"`, título enlazado.
- Labels vinculados por `htmlFor` y `id`.
- Errores expuestos visualmente con color y semánticamente mediante `aria-invalid`.
- Recomendación pendiente: manejar foco inicial al abrir modal y devolver foco al elemento que disparó la acción.

## 7. Dark Mode
- Activado por `class` (agregar `dark` en elemento root según preferencia usuario/estado).
- Colores neutrales usan variantes `dark:` ya incluidas en componentes.
- Pendiente: Toggle de tema central en `ThemeContext` y persistencia (localStorage).

## 8. Próximos Componentes Sugeridos
- `Badge` (estados rápidos: activo/inactivo, stock bajo)
- `TagInput` (futuros atributos dinámicos)
- `DataTable` (lista productos con paginación/sorting/accesibilidad)
- `Toast` centralizado (reemplazar mensaje inline manual)
- `ConfirmDialog` reutilizable (para borrar, cerrar con cambios etc.)

## 9. Buenas Prácticas de Código
- Evitar lógica duplicada de validación; centralizar si crece (e.g. utils/validation.js).
- Servicios deben devolver objetos coherentes `{ success, data, message }`.
- Evitar estado derivable: no guardar `isEditing` si puede inferirse.
- Prefijar ids de formularios (`product-form`, `category-form`).

## 10. Ejemplo de Uso Integrado (Producto)
```jsx
<Modal
  open={isOpen}
  onClose={close}
  title={product ? 'Editar Producto' : 'Nuevo Producto'}
  actions={<>
    <Button variant="secondary" onClick={close}>Cancelar</Button>
    <Button variant="primary" type="submit" form="product-form">Guardar</Button>
  </>}
>
  <ProductForm product={product} onSave={handleSave} formId="product-form" embedded showActions={false} />
</Modal>
```

## 11. Roadmap / Pendientes
| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| Alta | Toast system | Unificar feedback éxito/error. |
| Alta | Table accesible | Listas con teclado y roles. |
| Media | Tema oscuro toggle | Persistencia + icono UI. |
| Media | ConfirmDialog genérico | Para salidas con cambios y eliminaciones. |
| Media | Refactor restante formularios | Homogeneizar estilos. |
| Baja | Animaciones sutiles | micro-interacciones hover/focus. |
| Baja | Documentar storybook (opcional) | Catálogo visual componentes. |

## 12. Mantenimiento
- Al crear nuevo componente UI: documentar props en comentario JSDoc.
- Evitar CSS custom salvo casos complejos; preferir utilidades Tailwind.
- Revisar accesibilidad con Lighthouse y Axe periódicamente.

---
¿Dudas o mejoras? Extiende esta guía y mantén cambios versionados.
