/**
 * 🧪 Script de Verificación del Modal de Login
 * 
 * Ejecutar este script en la consola del navegador cuando estés en:
 * http://localhost:3001/admin/login
 * 
 * Copia y pega todo el código en la consola del navegador
 */

(function () {
    console.log('🔍 Iniciando verificación del modal de login...\n');

    // Esperar a que el DOM esté listo
    setTimeout(() => {
        const results = {
            passed: [],
            failed: [],
            warnings: []
        };

        // 1. Verificar que el modal existe
        const modal = document.querySelector('.login-modal');
        if (!modal) {
            console.error('❌ ERROR: No se encontró el modal .login-modal');
            return;
        }
        console.log('✅ Modal encontrado');

        // 2. Verificar dimensiones del modal
        const modalStyles = window.getComputedStyle(modal);
        const modalWidth = parseFloat(modalStyles.width);
        const modalMaxWidth = parseFloat(modalStyles.maxWidth);
        const modalPadding = parseFloat(modalStyles.padding);

        console.log('\n📏 DIMENSIONES DEL MODAL:');
        console.log(`   Ancho actual: ${modalWidth}px`);
        console.log(`   Max-width: ${modalMaxWidth}px`);
        console.log(`   Padding: ${modalPadding}px`);

        // Verificar max-width
        if (modalMaxWidth === 380) {
            results.passed.push('Max-width del modal: 380px ✓');
            console.log('   ✅ Max-width correcto (380px)');
        } else {
            results.failed.push(`Max-width del modal: ${modalMaxWidth}px (esperado: 380px)`);
            console.log(`   ❌ Max-width incorrecto: ${modalMaxWidth}px (esperado: 380px)`);
        }

        // Verificar padding
        if (modalPadding === 24) {
            results.passed.push('Padding del modal: 24px ✓');
            console.log('   ✅ Padding correcto (24px)');
        } else {
            results.failed.push(`Padding del modal: ${modalPadding}px (esperado: 24px)`);
            console.log(`   ❌ Padding incorrecto: ${modalPadding}px (esperado: 24px)`);
        }        // 3. Verificar logo
        const logo = document.querySelector('.neon-logo');
        if (logo) {
            const logoWidth = parseFloat(window.getComputedStyle(logo).width);
            console.log(`\n🖼️ LOGO:`);
            console.log(`   Ancho: ${logoWidth}px`);

            if (logoWidth === 90) {
                results.passed.push('Tamaño del logo: 90px ✓');
                console.log('   ✅ Tamaño correcto (90px)');
            } else {
                results.failed.push(`Tamaño del logo: ${logoWidth}px (esperado: 90px)`);
                console.log(`   ❌ Tamaño incorrecto: ${logoWidth}px (esperado: 90px)`);
            }
        }

        // 4. Verificar título
        const title = document.querySelector('.brand-title');
        if (title) {
            const titleFontSize = parseFloat(window.getComputedStyle(title).fontSize);
            console.log(`\n📝 TÍTULO:`);
            console.log(`   Font-size: ${titleFontSize}px`);

            if (titleFontSize === 28) {
                results.passed.push('Font-size del título: 28px ✓');
                console.log('   ✅ Font-size correcto (28px / 1.75rem)');
            } else {
                results.warnings.push(`Font-size del título: ${titleFontSize}px (esperado: 28px)`);
                console.log(`   ⚠️ Font-size: ${titleFontSize}px (esperado: 28px)`);
            }
        }

        // 5. Verificar form groups
        const formGroups = document.querySelectorAll('.form-group');
        if (formGroups.length > 0) {
            const firstGroup = formGroups[0];
            const groupMargin = parseFloat(window.getComputedStyle(firstGroup).marginBottom);
            console.log(`\n📋 FORM GROUPS:`);
            console.log(`   Cantidad: ${formGroups.length}`);
            console.log(`   Margin-bottom: ${groupMargin}px`);

            if (groupMargin === 16) {
                results.passed.push('Margin-bottom de form-group: 16px ✓');
                console.log('   ✅ Margin-bottom correcto (16px)');
            } else {
                results.failed.push(`Margin-bottom de form-group: ${groupMargin}px (esperado: 16px)`);
                console.log(`   ❌ Margin-bottom incorrecto: ${groupMargin}px (esperado: 16px)`);
            }
        }

        // 6. Verificar inputs
        const inputs = document.querySelectorAll('.form-input');
        if (inputs.length > 0) {
            const firstInput = inputs[0];
            const inputStyles = window.getComputedStyle(firstInput);
            const inputPaddingTop = parseFloat(inputStyles.paddingTop);
            const inputPaddingLeft = parseFloat(inputStyles.paddingLeft);

            console.log(`\n⌨️ INPUTS:`);
            console.log(`   Cantidad: ${inputs.length}`);
            console.log(`   Padding: ${inputPaddingTop}px ${inputPaddingLeft}px`);

            if (inputPaddingTop === 10 && inputPaddingLeft === 14) {
                results.passed.push('Padding de inputs: 10px 14px ✓');
                console.log('   ✅ Padding correcto (10px 14px)');
            } else {
                results.failed.push(`Padding de inputs: ${inputPaddingTop}px ${inputPaddingLeft}px (esperado: 10px 14px)`);
                console.log(`   ❌ Padding incorrecto: ${inputPaddingTop}px ${inputPaddingLeft}px (esperado: 10px 14px)`);
            }
        }

        // 7. Verificar botón submit
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            const btnStyles = window.getComputedStyle(submitBtn);
            const btnPaddingTop = parseFloat(btnStyles.paddingTop);
            const btnPaddingLeft = parseFloat(btnStyles.paddingLeft);

            console.log(`\n🔘 BOTÓN SUBMIT:`);
            console.log(`   Padding: ${btnPaddingTop}px ${btnPaddingLeft}px`);

            if (btnPaddingTop === 12 && btnPaddingLeft === 16) {
                results.passed.push('Padding del botón: 12px 16px ✓');
                console.log('   ✅ Padding correcto (12px 16px)');
            } else {
                results.failed.push(`Padding del botón: ${btnPaddingTop}px ${btnPaddingLeft}px (esperado: 12px 16px)`);
                console.log(`   ❌ Padding incorrecto: ${btnPaddingTop}px ${btnPaddingLeft}px (esperado: 12px 16px)`);
            }
        }

        // 8. Verificar que el modal no ocupa todo el viewport
        const viewportHeight = window.innerHeight;
        const modalHeight = modal.offsetHeight;
        const heightPercentage = (modalHeight / viewportHeight * 100).toFixed(1);

        console.log(`\n📐 VIEWPORT:`);
        console.log(`   Altura del viewport: ${viewportHeight}px`);
        console.log(`   Altura del modal: ${modalHeight}px`);
        console.log(`   Porcentaje: ${heightPercentage}%`);

        if (parseFloat(heightPercentage) < 90) {
            results.passed.push(`Modal ocupa ${heightPercentage}% del viewport ✓`);
            console.log(`   ✅ Modal no ocupa todo el espacio (${heightPercentage}%)`);
        } else {
            results.warnings.push(`Modal ocupa ${heightPercentage}% del viewport`);
            console.log(`   ⚠️ Modal ocupa mucho espacio (${heightPercentage}%)`);
        }

        // 9. Resumen final
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN DE LA VERIFICACIÓN');
        console.log('='.repeat(60));

        console.log(`\n✅ Tests aprobados (${results.passed.length}):`);
        results.passed.forEach(msg => console.log(`   • ${msg}`));

        if (results.warnings.length > 0) {
            console.log(`\n⚠️ Advertencias (${results.warnings.length}):`);
            results.warnings.forEach(msg => console.log(`   • ${msg}`));
        }

        if (results.failed.length > 0) {
            console.log(`\n❌ Tests fallidos (${results.failed.length}):`);
            results.failed.forEach(msg => console.log(`   • ${msg}`));
        }

        // 10. Resultado final
        const totalTests = results.passed.length + results.failed.length;
        const passRate = ((results.passed.length / totalTests) * 100).toFixed(1);

        console.log('\n' + '='.repeat(60));
        if (results.failed.length === 0) {
            console.log('🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!');
            console.log(`   Tasa de éxito: ${passRate}%`);
            console.log('   El modal está correctamente optimizado.');
        } else {
            console.log('⚠️ ALGUNOS TESTS FALLARON');
            console.log(`   Tasa de éxito: ${passRate}%`);
            console.log(`   Tests aprobados: ${results.passed.length}/${totalTests}`);
        }
        console.log('='.repeat(60) + '\n');

        // 11. Crear reporte visual en la página
        const report = document.createElement('div');
        report.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98));
      border: 2px solid ${results.failed.length === 0 ? '#00ff88' : '#ff0080'};
      border-radius: 15px;
      padding: 20px;
      z-index: 99999;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      color: white;
      font-family: 'Segoe UI', sans-serif;
    `;

        const statusColor = results.failed.length === 0 ? '#00ff88' : '#ff0080';
        const statusIcon = results.failed.length === 0 ? '✅' : '⚠️';
        const statusText = results.failed.length === 0 ? 'APROBADO' : 'REVISAR';

        report.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid rgba(255, 255, 255, 0.1);">
        <h3 style="margin: 0; color: ${statusColor}; font-size: 1.3rem;">🧪 Verificación</h3>
        <span style="background: ${statusColor}33; color: ${statusColor}; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 0.9rem;">
          ${statusIcon} ${statusText}
        </span>
      </div>
      <div style="margin-bottom: 10px;">
        <div style="color: #00ff88; margin-bottom: 5px;">✓ Aprobados: ${results.passed.length}</div>
        ${results.warnings.length > 0 ? `<div style="color: #ffc800; margin-bottom: 5px;">⚠ Advertencias: ${results.warnings.length}</div>` : ''}
        ${results.failed.length > 0 ? `<div style="color: #ff0080;">✗ Fallidos: ${results.failed.length}</div>` : ''}
      </div>
      <div style="font-size: 0.9rem; color: #aaa; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        Tasa de éxito: ${passRate}%
      </div>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 15px;
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #ff0080, #7928ca);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      ">
        Cerrar
      </button>
    `;

        document.body.appendChild(report);

        // Auto-cerrar después de 10 segundos
        setTimeout(() => {
            if (report.parentElement) {
                report.style.transition = 'opacity 0.5s ease';
                report.style.opacity = '0';
                setTimeout(() => report.remove(), 500);
            }
        }, 10000);

    }, 500);
})();

console.log('✨ Script de verificación cargado. Ejecutando en 500ms...');
