# 🌟 Lauti Design - Carteles de Neón LED

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

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

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
npm run dev          # Inicia servidor de desarrollo (localhost:3000)

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