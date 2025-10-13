<template>
  <div class="data-migration-info">
    <div class="container">
      <div class="header">
        <h1>🚫 Migraciones Deshabilitadas</h1>
        <p class="subtitle">Las operaciones de migración han sido retiradas de la interfaz de administración por seguridad. Si necesitás migrar datos, ejecutá los scripts CLI o procesos offline documentados en el repositorio.</p>
      </div>

      <div class="info-card">
        <h3>¿Por qué se removieron?</h3>
        <p>Para reducir la superficie de riesgo y evitar operaciones destructivas desde la UI. Las migraciones pueden modificar datos y almacenamiento; ahora deben realizarse manualmente por un operador autorizado.</p>
      </div>

      <div class="links-card">
        <h3>Enlaces útiles</h3>
        <ul>
          <li><a href="/admin" class="btn btn-outline">Volver al Admin</a></li>
          <li><a href="/galeria" class="btn btn-outline">Ver Galería</a></li>
          <li><a href="/README.md" class="btn btn-outline">Docs del Repositorio</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple informational placeholder - no migration logic here.
</script>

<style scoped>
.data-migration-info {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;

  .header {
    text-align: center;
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.75rem;
    }

    .subtitle {
      color: #64748b;
    }
  }

  .info-card, .links-card {
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  }

  .links-card ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 0.5rem;
  }
}
</style>
