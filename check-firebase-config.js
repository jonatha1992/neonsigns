#!/usr/bin/env node

/**
 * Script para verificar la configuración de Firebase
 * Ejecuta: node check-firebase-config.js
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env.local');

console.log('\n🔍 Verificando configuración de Firebase...\n');

// Check if .env.local exists
if (!existsSync(envPath)) {
  console.log('❌ ERROR: Archivo .env.local no encontrado\n');
  console.log('📝 Solución:');
  console.log('   1. Copia el archivo de ejemplo:');
  console.log('      cp .env.local.example .env.local\n');
  console.log('   2. Edita .env.local con tus credenciales de Firebase\n');
  process.exit(1);
}

// Read .env.local
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();
    if (key && value) {
      envVars[key] = value;
    }
  }
});

// Required variables
const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

let allValid = true;

console.log('📋 Verificando variables de entorno:\n');

required.forEach(key => {
  const value = envVars[key];
  const isValid = value && value !== 'your_' + key.toLowerCase().replace('vite_firebase_', '') + '_here';

  if (isValid) {
    console.log(`   ✅ ${key}`);
    if (key === 'VITE_FIREBASE_STORAGE_BUCKET') {
      if (value.startsWith('gs://')) {
        console.log(`      ⚠️  WARNING: Remueve el prefijo 'gs://' del bucket`);
        console.log(`      Debe ser: ${value.replace('gs://', '')}`);
        allValid = false;
      } else {
        console.log(`      📦 Bucket: ${value}`);
      }
    }
  } else {
    console.log(`   ❌ ${key} - No configurado o valor por defecto`);
    allValid = false;
  }
});

console.log('\n');

if (allValid) {
  console.log('✅ ¡Configuración completa!\n');
  console.log('🚀 Próximos pasos:');
  console.log('   1. Inicia el servidor: npm run dev');
  console.log('   2. Ve a: http://localhost:5173/admin/login');
  console.log('   3. Login con: tecnofusion.it@gmail.com');
  console.log('   4. Ve a "Migración" y ejecuta la migración completa\n');
} else {
  console.log('❌ Configuración incompleta\n');
  console.log('📝 Para configurar Firebase:');
  console.log('   1. Ve a: https://console.firebase.google.com/project/neon-signs-app/settings/general');
  console.log('   2. Copia los valores de firebaseConfig');
  console.log('   3. Pégalos en .env.local\n');
  console.log('⚠️  IMPORTANTE: El STORAGE_BUCKET debe ser sin "gs://"\n');
  process.exit(1);
}
