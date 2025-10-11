/**
 * 🧪 SCRIPT DE PRUEBA DE CONEXIÓN FIREBASE
 * ========================================
 * 
 * Verifica que la configuración de Firebase esté correcta y que
 * podamos conectar con Firestore y Storage antes de la migración.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🧪 VERIFICACIÓN DE CONFIGURACIÓN FIREBASE');
console.log('==========================================\n');

// Verificar variables de entorno
const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

console.log('1️⃣ Verificando variables de entorno...');
const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:');
    missingVars.forEach(envVar => console.error(`   - ${envVar}`));
    console.error('\n💡 Pasos para solucionarlo:');
    console.error('   1. Copia .env.local.example a .env.local');
    console.error('   2. Completa los valores desde Firebase Console');
    console.error('   3. Ejecuta este script nuevamente\n');
    process.exit(1);
}

console.log('✅ Todas las variables de entorno están configuradas\n');

// Configuración Firebase
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY!,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.VITE_FIREBASE_APP_ID!
};

console.log('2️⃣ Configuración Firebase:');
console.log(`   📄 Proyecto: ${firebaseConfig.projectId}`);
console.log(`   🏠 Dominio: ${firebaseConfig.authDomain}`);
console.log(`   💾 Storage: ${firebaseConfig.storageBucket}`);
console.log(`   🔐 API Key: ${firebaseConfig.apiKey.substring(0, 10)}...`);

let app: any;
let db: any;
let storage: any;

async function testFirebaseConnection() {
    try {
        console.log('\n3️⃣ Inicializando Firebase...');

        // Inicializar Firebase
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);

        console.log('✅ Firebase inicializado correctamente');

        // Test Firestore
        console.log('\n4️⃣ Probando conexión a Firestore...');
        const testDocRef = doc(db, 'test', 'connection-test');

        // Escribir documento de prueba
        await setDoc(testDocRef, {
            message: 'Conexión exitosa',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });

        console.log('✅ Documento de prueba creado');

        // Leer documento de prueba
        const docSnap = await getDoc(testDocRef);
        if (docSnap.exists()) {
            console.log('✅ Document leído correctamente');
            console.log(`   📄 Datos: ${JSON.stringify(docSnap.data())}`);
        } else {
            throw new Error('Documento de prueba no encontrado');
        }

        // Eliminar documento de prueba
        await deleteDoc(testDocRef);
        console.log('✅ Documento de prueba eliminado');

        // Test Storage
        console.log('\n5️⃣ Probando conexión a Storage...');

        // Crear archivo de prueba
        const testContent = Buffer.from('Archivo de prueba para Firebase Storage');
        const testRef = ref(storage, 'test/connection-test.txt');

        // Subir archivo
        await uploadBytes(testRef, testContent, {
            contentType: 'text/plain',
            customMetadata: {
                test: 'true',
                timestamp: new Date().toISOString()
            }
        });

        console.log('✅ Archivo de prueba subido');

        // Obtener URL de descarga
        const downloadURL = await getDownloadURL(testRef);
        console.log('✅ URL de descarga obtenida');
        console.log(`   🔗 URL: ${downloadURL.substring(0, 50)}...`);

        // Eliminar archivo de prueba
        await deleteObject(testRef);
        console.log('✅ Archivo de prueba eliminado');

        console.log('\n6️⃣ Verificando imágenes locales...');
        const imagesPath = path.join(process.cwd(), 'public', 'images');

        if (!fs.existsSync(imagesPath)) {
            throw new Error(`Directorio de imágenes no encontrado: ${imagesPath}`);
        }

        const imageFiles = fs.readdirSync(imagesPath).filter(file =>
            file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg')
        );

        console.log(`✅ Encontradas ${imageFiles.length} imágenes para migrar:`);
        imageFiles.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file}`);
        });

        // Resumen final
        console.log('\n' + '='.repeat(50));
        console.log('🎉 ¡PRUEBA EXITOSA!');
        console.log('='.repeat(50));
        console.log('✅ Firebase configurado correctamente');
        console.log('✅ Firestore funcionando');
        console.log('✅ Storage funcionando');
        console.log(`✅ ${imageFiles.length} imágenes listas para migrar`);
        console.log('\n📋 Próximos pasos:');
        console.log('   1. Ejecutar: npm run migrate-firestore');
        console.log('   2. Verificar datos en Firebase Console');
        console.log('   3. Probar la aplicación');
        console.log('='.repeat(50) + '\n');

    } catch (error: any) {
        console.error('\n❌ ERROR EN LA PRUEBA:');
        console.error('='.repeat(30));
        console.error(`💥 ${error.message}`);

        if (error.code) {
            console.error(`🔧 Código de error: ${error.code}`);
        }

        console.error('\n🔍 Posibles soluciones:');
        console.error('1. Verificar que las credenciales de Firebase sean correctas');
        console.error('2. Comprobar que el proyecto exista en Firebase Console');
        console.error('3. Verificar permisos de Firestore y Storage');
        console.error('4. Revisar reglas de seguridad de Firebase');
        console.error('='.repeat(30) + '\n');

        process.exit(1);
    }
}

// Ejecutar prueba
testFirebaseConnection().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});