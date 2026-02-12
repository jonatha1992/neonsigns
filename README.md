# 🌟 Neon Designs - Carteles de Neón LED

Landing page profesional para mostrar trabajos realizados de carteles de neón LED, desarrollada con Vue 3, TypeScript y animaciones premium.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)

## ✨ Características

- 🎨 **Portfolio Visual**: Galería de trabajos reales con modal interactivo
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- ⚡ **Animaciones Premium**: Efectos visuales profesionales con tema neón
- �️ **Modal de Imágenes**: Visualización ampliada con información detallada
- � **WhatsApp Integration**: Contacto directo para cotizaciones
- 🌟 **Spinner Personalizado**: Carga con efectos neón y múltiples anillos
- 🌙 **Tema Neón**: Diseño inmersivo con colores vibrantes

## 🚀 Demo en Vivo

[Ver Portfolio](https://jonatha1992.github.io/neonsign)

## 🔥 Sistema ABM de Administración (NUEVO)

### Panel de Administración con Firebase

Este proyecto ahora incluye un **sistema completo de administración (ABM)** para gestionar la galería de productos con Firebase:

- ✅ **Autenticación**: Login seguro con Firebase Authentication
- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar items de la galería
- ✅ **Cloud Firestore**: Base de datos en tiempo real
- ✅ **Firebase Storage**: Almacenamiento de imágenes con compresión
- ✅ **Items Destacados**: Sistema para marcar exactamente 4 items destacados (se muestran en Home)
- ✅ **Ordenamiento Manual**: Drag & drop para reordenar items
- ✅ **Categorías**: Negocios, Personalizado, Hogar, Eventos, Decorativo

### 📚 Documentación del Sistema ABM

| Documento | Descripción |
|-----------|-------------|
| **[ENV-CONVENTION.md](ENV-CONVENTION.md)** | Convenciones y uso correcto de archivos `.env` |
| [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md) | Guía de migración de datos y entorno Firebase |
| [DEPLOY-SUCCESS.md](DEPLOY-SUCCESS.md) | Checklist de deploy y enlaces de producción |

### 🎯 Estado de Implementación

| Fase | Estado | Descripción |
|------|--------|-------------|
| **1. Firebase Configuration** | ✅ Completado | Configuración de Firebase, tipos TypeScript, reglas de seguridad |
| **2. Authentication System** | ✅ Completado | Login, guards de rutas, validación de admin |
| **3. Core Services & CRUD** | ✅ Completado | Firestore CRUD, Storage, estados con Pinia |
| **4. Admin Panel UI** | 📝 Pendiente | Dashboard, formularios, drag & drop |
| **5. Frontend Integration** | 📝 Pendiente | Integrar Firestore con vistas existentes |
| **6. Data Migration** | 📝 Pendiente | Migrar productos mock a Firestore |
| **7. Documentation** | 📝 Pendiente | Docs completas y handoff a QA |

### 🚀 Inicio Rápido - Admin Panel

**Requisitos previos**: Firebase project configurado

1. **Configurar Firebase**:
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales de Firebase
   # Opcional IA: agregar VITE_GEMINI_API_KEY para autocompletar formulario con foto
   ```

2. **Iniciar servidor**:
   ```bash
   npm run dev
   ```

3. **Acceder al panel de administración**:
   ```
   http://localhost:3000/admin/login
   ```

4. **Credenciales** (configuradas en Firebase Authentication):
   - Email: `tecnofusion.it@gmail.com`
   - Password: [Tu contraseña configurada en Firebase]

### 🧪 Verificación local

```bash
npm run lint
npm run type-check
npm run build
```

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- **[Firebase Account](https://firebase.google.com/)** (para el sistema ABM)

## 🛠️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/jonatha1992/neonsign.git
   cd neonsign
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
│   │   └── Contact.vue
│   ├── stores/
│   │   ├── auth.ts
│   │   └── products.ts
│   ├── styles/
│   │   └── tailwind.css
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

### Herramientas de Desarrollo
- **Vite** - Build tool ultrarrápido
- **ESLint** - Linter para JavaScript/TypeScript
- **Tailwind CSS** - Utilidades CSS para UI
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
npm run dev          # Inicia servidor de desarrollo (localhost:3000)
npm run generate-sitemap

# Construcción
npm run build        # Construye para producción
npm run preview      # Preview de la build de producción

# Deploy
npm run predeploy    # Prepara build para GitHub Pages
npm run deploy       # Deploy automático a GitHub Pages

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🌐 Deploy a GitHub Pages

### Configuración Automática
El proyecto incluye GitHub Actions para deploy automático:

1. **Push a main** → Deploy automático activado
2. **URL final**: `https://jonatha1992.github.io/neonsign`

### Deploy Manual
```bash
npm run deploy       # Deploy directo usando gh-pages
```

### Instrucciones de Setup
1. **Crear repositorio** en GitHub con nombre: `neonsign`
2. **Comandos para subir:**
   ```bash
   git init
   git add .
   git commit -m "feat: portfolio profesional Lauti Design"
   git branch -M main
   git remote add origin https://github.com/jonatha1992/neonsign.git
   git push -u origin master
   ```
3. **Habilitar GitHub Pages** en Settings → Pages → Source: GitHub Actions

## 🌟 Funcionalidades Principales

### 🏠 Landing Page
- Hero section con efectos de neón premium
- Grid de trabajos realizados
- Información de contacto profesional
- Integración WhatsApp directa

### �️ Galería de Trabajos
- 8 proyectos reales completados
- Modal interactivo para visualización ampliada
- Categorización por tipo de trabajo
- Efectos hover profesionales

### � Sistema de Contacto
- WhatsApp: +54 9 11 4091-6764
- Ubicación: Zona Sur, Buenos Aires
- Mensajes contextuales por trabajo
- Cotizaciones directas

### 🎨 Portfolio Actual
- **Hombre Araña** - Diseño temático personalizado
- **Pizza** - Letreros comerciales para pizzerías
- **Cerrajería** - Señalización profesional comercial
- **Tecno Alfa** - Logo empresarial bicolor
- **Happy Birthday** - Celebraciones especiales
- **Nombres Personalizados** - Diseños elegantes para hogar
- **Lavadero El Veci** - Letrero comercial multicolor

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

- [ ] Más trabajos al portfolio
- [ ] Galería de proceso de fabricación
- [ ] Sistema de cotizaciones online
- [ ] Integración con Instagram
- [ ] PWA (Progressive Web App)
- [ ] Formulario de contacto avanzado

## 📞 Contacto

**Lauti Design** - Especialistas en Carteles de Neón LED

- 📱 **WhatsApp**: +54 9 11 4091-6764
- 📍 **Ubicación**: Zona Sur, Buenos Aires
- 🌐 **Portfolio**: [https://jonatha1992.github.io/neonsign](https://jonatha1992.github.io/neonsign)

Enlace del Proyecto: [https://github.com/jonatha1992/neonsign](https://github.com/jonatha1992/neonsign)

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

---

⭐ Si te gusta este portfolio, ¡dale una estrella en GitHub!

**🌟 Landing Page Profesional para Lauti Design - Carteles de Neón LED (Zona Sur, Buenos Aires)**

Made with ❤️ and ⚡ by Lauti Design
