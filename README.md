# 🌟 Neon Signs Store

Una aplicación web profesional para la venta de carteles de neón, desarrollada con Vue.js 3, TypeScript y diseño responsivo.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-hotpink?style=for-the-badge&logo=SASS&logoColor=white)

## ✨ Características

- 🎨 **Diseño moderno**: Interfaz atractiva con efectos de neón y animaciones
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- ⚡ **Rendimiento**: Construido con Vite para carga rápida
- 🛒 **E-commerce**: Sistema completo de carrito de compras
- 🔍 **Filtros avanzados**: Búsqueda y filtrado de productos
- 💳 **Proceso de compra**: Checkout optimizado y user-friendly
- 🌙 **Efectos visuales**: Animaciones y efectos de neón inmersivos

## 🚀 Demo

[Ver Demo en Vivo](https://your-demo-link.com) (Próximamente)

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🛠️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/neon-signs-store.git
   cd neon-signs-store
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
neon-signs-store/
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── product/
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Products.vue
│   │   ├── ProductDetail.vue
│   │   ├── Cart.vue
│   │   └── Contact.vue
│   ├── stores/
│   │   ├── cart.ts
│   │   └── products.ts
│   ├── styles/
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   └── global.scss
│   ├── utils/
│   ├── router/
│   ├── types/
│   ├── App.vue
│   └── main.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Tecnologías Utilizadas

### Frontend
- **Vue.js 3** - Framework progresivo de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Vue Router** - Enrutamiento oficial para Vue.js
- **Pinia** - Gestión de estado moderna para Vue
- **VueUse** - Colección de utilidades de composición

### Herramientas de Desarrollo
- **Vite** - Build tool ultrarrápido
- **ESLint** - Linter para JavaScript/TypeScript
- **Sass/SCSS** - Preprocesador CSS
- **Lucide Vue** - Iconos modernos para Vue

### Características de Diseño
- **Efectos de neón** personalizados
- **Gradientes dinámicos**
- **Animaciones CSS** fluidas
- **Grid layouts** responsivos
- **Modo oscuro** integrado

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Preview de la build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🌟 Funcionalidades Principales

### 🏠 Página de Inicio
- Hero section con efectos de neón
- Productos destacados
- Categorías principales
- Testimonios de clientes

### 🛍️ Catálogo de Productos
- Grid responsivo de productos
- Filtros por categoría, precio y color
- Búsqueda en tiempo real
- Paginación

### 📄 Detalle de Producto
- Galería de imágenes
- Información detallada
- Opciones de personalización
- Sistema de reseñas

### 🛒 Carrito de Compras
- Gestión de productos
- Cálculo automático de totales
- Cupones de descuento
- Proceso de checkout

## 🎨 Personalización

### Variables de Color (SCSS)
```scss
// Colores principales de neón
$neon-pink: #ff0080;
$neon-blue: #00ffff;
$neon-green: #00ff00;
$neon-purple: #8000ff;

// Colores de fondo
$dark-bg: #0a0a0a;
$card-bg: #1a1a1a;
```

### Configuración de Efectos
Los efectos de neón se pueden customizar en `src/styles/neon-effects.scss`

## 📱 Responsive Design

- **Mobile First**: Diseñado primero para móviles
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Componentes adaptativos**: Todos los componentes se ajustan automáticamente

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus changes (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Integración con pasarela de pagos
- [ ] Panel de administración
- [ ] Sistema de usuarios
- [ ] Chat en vivo
- [ ] PWA (Progressive Web App)
- [ ] Análisis con Google Analytics

## 📞 Contacto

**Lauti Design** - [@lautidesign](https://github.com/lautidesign)

Enlace del Proyecto: [https://github.com/lautidesign/neon-signs-store](https://github.com/lautidesign/neon-signs-store)

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

Made with ❤️ and ⚡ by Lauti Design