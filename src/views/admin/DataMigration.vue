<template>
  <div class="data-migration-info">
    <div class="container">
      <div class="header">
        <h1>� Migraciones Deshabilitadas</h1>
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
          <li><a href="/admin/gallery" class="btn btn-outline">Gallery Manager</a></li>
          <li><a href="/README.md" class="btn btn-outline">Docs del Repositorio</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple informational placeholder - no migration logic here.
</script>

<style scoped lang="scss">
.data-migration-info {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;

  .header {
    text-align: center;
    margin-bottom: 1.5rem;

    h1 { font-size: 1.75rem; }
    .subtitle { color: #64748b; }
  }

  .info-card, .links-card {
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  }

  .links-card ul { list-style: none; padding: 0; display: flex; gap: 0.5rem; }
}
</style>
  margin: 0 auto;
  padding: 2rem;
}

.migration-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #64748b;
    font-size: 1.1rem;
  }
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.status-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;

  h3 {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 1rem;
  }
}

.migration-progress {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: #1e293b;
  }

  .progress-bar {
    height: 24px;
    background: #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.3s ease;
  }

  .progress-text {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
  }
}

.local-images-section {
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    color: #1e293b;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .image-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }

    .image-info {
      padding: 0.75rem;

      .image-name {
        font-size: 0.85rem;
        margin: 0 0 0.5rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;

        &.badge-success {
          background: #dcfce7;
          color: #166534;
        }

        &.badge-pending {
          background: #fef3c7;
          color: #92400e;
        }
      }
    }
  }
}

.migration-actions {
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    color: #1e293b;
  }

  .action-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1rem;

    .action-header {
      margin-bottom: 1rem;

      h3 {
        color: #1e293b;
        margin-bottom: 0.5rem;
      }

      p {
        color: #64748b;
        margin: 0;
      }
    }
  }
}

.migration-log {
  background: #1e293b;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h2 {
    color: white;
    margin-bottom: 1rem;
  }

  .log-container {
    max-height: 400px;
    overflow-y: auto;
    background: #0f172a;
    border-radius: 0.25rem;
    padding: 1rem;
  }

  .log-entry {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-bottom: 1px solid #334155;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;

    &:last-child {
      border-bottom: none;
    }

    &.log-success {
      color: #86efac;
    }

    &.log-error {
      color: #fca5a5;
    }

    &.log-warning {
      color: #fde047;
    }

    &.log-info {
      color: #93c5fd;
    }

    .log-time {
      color: #94a3b8;
      font-size: 0.75rem;
    }
  }
}

.help-section {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 1.5rem;

  h3 {
    color: #1e40af;
    margin-bottom: 1rem;
  }

  ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
      color: #1e293b;
    }
  }

  .help-note {
    background: white;
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin: 0;
    color: #475569;

    i {
      color: #3b82f6;
      margin-right: 0.5rem;
    }

    code {
      background: #f1f5f9;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-family: 'Courier New', monospace;
      color: #dc2626;
    }
  }
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
    }
  }

  &.btn-secondary {
    background: #64748b;
    color: white;

    &:hover:not(:disabled) {
      background: #475569;
    }
  }

  &.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  &.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
}
</style>
