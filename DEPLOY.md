# 🚀 Deploy Automático - Configuración

## ⚡ **¡El deploy automático ya está configurado!**

### 📋 **Pasos para activar el deploy automático:**

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/jonatha1992/neonsigns
   ```

2. **Configura el secreto de Firebase (ACTUALIZADO):**
   - Ve a **Settings** → **Secrets and variables** → **Actions**
   - Si ya existe `FIREBASE_TOKEN`, elimínalo
   - Click en **New repository secret**
   - **Name:** `FIREBASE_TOKEN`
   - **Value:** `1//0hcMzlOfETfDwCgYIARAAGBESNwF-L9IroCuMjdvlBA-nBeJILJ-0-dHwoO-1i5C-ASojEJuAI7AlvQqNtO3lVCyJRnLDOhlh7TY`
   - Click **Add secret**

   **⚠️ IMPORTANTE:** Este es un nuevo token generado. El anterior puede haber expirado.

## 🎯 **¿Cómo funciona?**

### **Trigger automático:**
- Cada vez que hagas `git push` a la rama `master`
- Se ejecuta automáticamente el workflow de GitHub Actions
- Construye el proyecto (`npm run build`)
- Lo deploya a Firebase Hosting
- ¡Tu sitio se actualiza automáticamente!

### **URL del sitio:**
```
https://neon-signs-app.web.app
```

## 📝 **Comandos para desarrollo:**

```bash
# Desarrollo local
npm run dev

# Build manual (opcional)
npm run build

# Deploy manual (opcional, ya no necesario)
firebase deploy

# Para commits y deploy automático
git add .
git commit -m "tu mensaje"
git push origin master
```

## ✅ **Estado del deploy:**
Puedes verificar el estado de los deploys en:
```
https://github.com/jonatha1992/neonsigns/actions
```

## 🎉 **¡Listo!**
Una vez que agregues el secreto, cada commit se desplegará automáticamente.

---
**Desarrollado por Lauti Design** 🌟