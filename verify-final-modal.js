#!/usr/bin/env node

/**
 * 🔍 VERIFICACIÓN FINAL DEL MODAL DE LOGIN OPTIMIZADO
 * ===================================================
 *
 * Script para verificar que el modal cumple con todas las especificaciones
 * después de la segunda optimización.
 *
 * Fecha: 10 de octubre de 2025
 * Versión: 2.1 - ULTRA-COMPACTO
 */

const puppeteer = require('puppeteer');

async function verifyLoginModal() {
    console.log('🚀 Iniciando verificación final del modal de login...\n');

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1280, height: 720 }
        });

        const page = await browser.newPage();
        await page.goto('http://localhost:3002/admin/login');

        // Esperar a que el modal se cargue completamente
        await page.waitForSelector('.login-modal', { timeout: 10000 });

        console.log('✅ Modal encontrado y cargado\n');

        // Verificar dimensiones del modal
        const modalDimensions = await page.evaluate(() => {
            const modal = document.querySelector('.login-modal');
            if (!modal) return null;

            const rect = modal.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(modal);

            return {
                width: rect.width,
                height: rect.height,
                maxWidth: computedStyle.maxWidth,
                padding: computedStyle.padding,
                display: computedStyle.display,
                position: computedStyle.position
            };
        });

        console.log('📏 DIMENSIONES DEL MODAL:');
        console.log(`   Ancho: ${modalDimensions.width}px`);
        console.log(`   Alto: ${modalDimensions.height}px`);
        console.log(`   Max-width: ${modalDimensions.maxWidth}`);
        console.log(`   Padding: ${modalDimensions.padding}`);
        console.log(`   Posición: ${modalDimensions.position}\n`);

        // Verificar logo
        const logoDimensions = await page.evaluate(() => {
            const logo = document.querySelector('.modal-logo img');
            if (!logo) return null;

            const rect = logo.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height
            };
        });

        console.log('🖼️ DIMENSIONES DEL LOGO:');
        console.log(`   Ancho: ${logoDimensions.width}px`);
        console.log(`   Alto: ${logoDimensions.height}px\n`);

        // Verificar título
        const titleDimensions = await page.evaluate(() => {
            const title = document.querySelector('.brand-title');
            if (!title) return null;

            const computedStyle = window.getComputedStyle(title);
            return {
                fontSize: computedStyle.fontSize,
                fontWeight: computedStyle.fontWeight
            };
        });

        console.log('📝 TIPOGRAFÍA DEL TÍTULO:');
        console.log(`   Font-size: ${titleDimensions.fontSize}`);
        console.log(`   Font-weight: ${titleDimensions.fontWeight}\n`);

        // Verificar inputs
        const inputDimensions = await page.evaluate(() => {
            const inputs = document.querySelectorAll('.form-group input');
            if (inputs.length === 0) return null;

            const firstInput = inputs[0];
            const computedStyle = window.getComputedStyle(firstInput);

            return {
                padding: computedStyle.padding,
                fontSize: computedStyle.fontSize,
                borderRadius: computedStyle.borderRadius
            };
        });

        console.log('📝 DIMENSIONES DE INPUTS:');
        console.log(`   Padding: ${inputDimensions.padding}`);
        console.log(`   Font-size: ${inputDimensions.fontSize}`);
        console.log(`   Border-radius: ${inputDimensions.borderRadius}\n`);

        // Verificar botón
        const buttonDimensions = await page.evaluate(() => {
            const button = document.querySelector('.login-form button[type="submit"]');
            if (!button) return null;

            const computedStyle = window.getComputedStyle(button);

            return {
                padding: computedStyle.padding,
                fontSize: computedStyle.fontSize,
                borderRadius: computedStyle.borderRadius
            };
        });

        console.log('🔘 DIMENSIONES DEL BOTÓN:');
        console.log(`   Padding: ${buttonDimensions.padding}`);
        console.log(`   Font-size: ${buttonDimensions.fontSize}`);
        console.log(`   Border-radius: ${buttonDimensions.borderRadius}\n`);

        // Verificar ocupación del viewport
        const viewportOccupation = await page.evaluate(() => {
            const modal = document.querySelector('.login-modal');
            if (!modal) return null;

            const modalRect = modal.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            return {
                modalHeightPercent: (modalRect.height / viewportHeight * 100).toFixed(1),
                modalWidthPercent: (modalRect.width / viewportWidth * 100).toFixed(1),
                viewportHeight: viewportHeight,
                viewportWidth: viewportWidth
            };
        });

        console.log('📊 OCUPACIÓN DEL VIEWPORT:');
        console.log(`   Modal ocupa: ${viewportOccupation.modalHeightPercent}% de altura`);
        console.log(`   Modal ocupa: ${viewportOccupation.modalWidthPercent}% de ancho`);
        console.log(`   Viewport: ${viewportOccupation.viewportWidth}x${viewportOccupation.viewportHeight}\n`);

        // Verificar si requiere scroll
        const requiresScroll = await page.evaluate(() => {
            const modal = document.querySelector('.login-modal');
            if (!modal) return null;

            const modalRect = modal.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            return modalRect.height > viewportHeight * 0.9; // Si ocupa más del 90%
        });

        console.log('📜 VERIFICACIÓN DE SCROLL:');
        console.log(`   ¿Requiere scroll? ${requiresScroll ? '❌ SÍ' : '✅ NO'}\n`);

        // VALIDACIONES FINALES
        console.log('🎯 VALIDACIONES FINALES:');
        console.log('======================');

        const validations = [
            { name: 'Modal max-width ≤ 380px', pass: modalDimensions.width <= 380 },
            { name: 'Modal padding = 24px', pass: modalDimensions.padding === '24px' },
            { name: 'Logo width = 90px', pass: logoDimensions.width === 90 },
            { name: 'Title font-size = 28px', pass: titleDimensions.fontSize === '28px' },
            { name: 'Input padding = 10px 14px', pass: inputDimensions.padding === '10px 14px' },
            { name: 'Button padding = 12px 16px', pass: buttonDimensions.padding === '12px 16px' },
            { name: 'Ocupa < 75% viewport', pass: parseFloat(viewportOccupation.modalHeightPercent) < 75 },
            { name: 'NO requiere scroll', pass: !requiresScroll }
        ];

        let allPass = true;
        validations.forEach(validation => {
            const status = validation.pass ? '✅' : '❌';
            console.log(`${status} ${validation.name}`);
            if (!validation.pass) allPass = false;
        });

        console.log('\n' + '='.repeat(50));
        if (allPass) {
            console.log('🎉 ¡TODAS LAS VALIDACIONES PASAN!');
            console.log('✅ El modal está PERFECTAMENTE OPTIMIZADO');
        } else {
            console.log('⚠️  Algunas validaciones fallaron');
            console.log('🔧 Revisar las especificaciones');
        }
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Ejecutar verificación
verifyLoginModal().catch(console.error);