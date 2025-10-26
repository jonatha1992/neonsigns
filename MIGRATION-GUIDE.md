# 🔥 Migración de Imágenes a Firebase Storage

Este documento explica cómo migrar las imágenes locales a Firebase Storage y actualizar los documentos de Firestore.

## 📋 Estado Actual

- **Colección Firestore**: `gallery_items` (8 documentos)
- **Imágenes locales**: `public/images/` (8 archivos .jpeg)
- **Problema**: Las URLs en Firestore apuntan a `/images/` local, no a Firebase Storage

## 🎯 Objetivo

Subir todas las imágenes a Firebase Storage y actualizar las URLs en Firestore para que la aplicación funcione completamente desde Firebase.

## 🚀 Proceso de Migración

### Paso 1: Verificar Estado Actual

```bash
npm run check-firestore
```

Este comando muestra:
- Qué colecciones existen
- Cuántos documentos hay en cada una
- Las primeras 3 entradas de cada colección

### Paso 2: Ejecutar Migración

```bash
npm run migrate-images
```

El script te pedirá:
1. **Email de admin**: Tu correo de Firebase Auth
2. **Contraseña**: Tu contraseña

Luego:
- ✅ Sube cada imagen a `gs://neon-signs-app.firebasestorage.app/gallery/`
- ✅ Actualiza cada documento con la URL de Firebase Storage
- ✅ Mantiene los metadatos (título, categoría, precio, etc.)

### Paso 3: Verificar Resultado

Después de la migración, verifica que:

```bash
npm run check-firestore
```

Las URLs ahora deben verse como:
```
https://firebasestorage.googleapis.com/v0/b/neon-signs-app.appspot.com/...
```

En lugar de:
```
/images/nombre-archivo.jpeg
```

### Paso 4: Probar la Aplicación

```bash
npm run dev
```

Visita `http://localhost:3001` y verifica que:
- ✅ Las imágenes se cargan desde Firebase
- ✅ Los productos aparecen en la galería
- ✅ Los detalles de productos funcionan

## 📁 Estructura de Datos

### Antes (Firestore)
```json
{
  "title": "Lavadero El Veci - Comercial",
  "description": "Letrero comercial para lavadero...",
  "price": 11000,
  "imageUrl": "/images/lavadero.jpeg",  // ❌ Local
  "category": "negocios",
  "isFeatured": false,
  "isActive": true
}
```

### Después (Firestore)
```json
{
  "title": "Lavadero El Veci - Comercial",
  "description": "Letrero comercial para lavadero...",
  "price": 11000,
  "imageUrl": "https://firebasestorage.googleapis.com/...",  // ✅ Firebase
  "category": "negocios",
  "isFeatured": false,
  "isActive": true
}
```

## 🔧 Servicios Actualizados

### `ProductsService`
- ✅ Lee de `gallery_items` collection
- ✅ Adapta datos al formato `Product`
- ✅ Mapea categorías de español a inglés
- ✅ Genera datos adicionales (colors, sizes, rating)

### `ProductsStore`
- ✅ Usa `ProductsService` para obtener datos
- ✅ Fallback a datos mock si Firestore falla
- ✅ Caché local de productos
- ✅ Filtros y búsqueda

## 🗂️ Archivos de Imágenes

Las siguientes imágenes se migrarán:

1. `cerrajeria.jpeg`
2. `harppit bithday.jpeg`
3. `hombre araña.jpeg`
4. `lavadero.jpeg`
5. `nombre.jpeg`
6. `pizza.jpeg`
7. `pizza2.jpeg`
8. `tecno alfa.jpeg`

## 🔐 Reglas de Storage

Las reglas actuales permiten:
- ✅ **Lectura pública**: Cualquiera puede ver las imágenes
- ✅ **Escritura autenticada**: Solo usuarios autenticados pueden subir
- ✅ **Eliminación admin**: Solo admins pueden eliminar

```javascript
match /gallery/{allPaths=**} {
  allow read: if true;
  allow write: if isAuthenticated();
  allow delete: if isAdmin();
}
```

## ❓ Solución de Problemas

### Error: "auth/invalid-credential"
- Verifica que el email y contraseña sean correctos
- Asegúrate de tener una cuenta creada en Firebase Auth

### Error: "Archivo no encontrado"
- Verifica que las imágenes estén en `public/images/`
- Los nombres deben coincidir exactamente con los de Firestore

### Error: "Permission denied"
- Verifica las reglas de Storage en Firebase Console
- Asegúrate de estar autenticado correctamente

### Las imágenes no se ven en la app
- Limpia caché del navegador
- Verifica que las URLs en Firestore sean de Firebase Storage
- Revisa la consola del navegador por errores CORS

## 📊 Scripts Disponibles

```bash
# Ver estado de Firestore
npm run check-firestore

# Migrar imágenes
npm run migrate-images

# Verificar proyecto
npm run project-status

# Probar conexión Firebase
npm run test-firebase

# Iniciar desarrollo
npm run dev

# Build para producción
npm run build
```

## ✨ Después de la Migración

Una vez completada la migración:

1. ✅ Todas las imágenes estarán en Firebase Storage
2. ✅ Los documentos tendrán URLs actualizadas
3. ✅ La aplicación cargará datos 100% desde Firebase
4. ✅ No dependerás de archivos locales
5. ✅ Las imágenes serán accesibles desde cualquier lugar

## 🎉 ¡Listo!

Tu aplicación ahora usa Firebase completamente para:
- 🗄️ **Firestore**: Datos de productos
- 🖼️ **Storage**: Imágenes
- 🔐 **Auth**: Autenticación de admins

¡La migración está completa! 🚀
