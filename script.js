document.addEventListener('DOMContentLoaded', function() {
    // Datos almacenados
    let registros = JSON.parse(localStorage.getItem('registrosCalidad')) || [];
    let segmentos = JSON.parse(localStorage.getItem('segmentosPersonalizados')) || [];
    let bloques = JSON.parse(localStorage.getItem('bloquesPersonalizados')) || [];
    let comentariosPredeterminados = JSON.parse(localStorage.getItem('comentariosPredeterminados')) || [];
    let codigoTecnicoGuardado = localStorage.getItem('codigoTecnico') || '';
    
    // Referencias a elementos del DOM
    const elementos = {
        codigoTecnico: document.getElementById('codigoTecnico'),
        nuevoSegmento: document.getElementById('nuevoSegmento'),
        agregarSegmento: document.getElementById('agregarSegmento'),
        listaSegmentos: document.getElementById('listaSegmentos'),
        selectSegmento: document.getElementById('segmento'),
        
        nuevoBloque: document.getElementById('nuevoBloque'),
        agregarBloque: document.getElementById('agregarBloque'),
        listaBloques: document.getElementById('listaBloques'),
        selectBloque: document.getElementById('bloque'),
        
        nuevoComentario: document.getElementById('nuevoComentario'),
        agregarComentario: document.getElementById('agregarComentario'),
        listaComentarios: document.getElementById('listaComentarios'),
        selectComentario: document.getElementById('comentarioPredeterminado'),
        quitarComentarioPred: document.getElementById('quitarComentarioPred'),
        
        numeroEstructura: document.getElementById('numeroEstructura'),
        comentarioPersonalizado: document.getElementById('comentarioPersonalizado'),
        
        btnGuardar: document.getElementById('guardar'),
        btnGenerar: document.getElementById('generar'),
        btnLimpiar: document.getElementById('limpiar'),
        
        listaRegistros: document.getElementById('listaRegistros'),
        output: document.getElementById('output')
    };

    // Cargar datos guardados al iniciar
    function cargarDatosIniciales() {
        if (codigoTecnicoGuardado) {
            elementos.codigoTecnico.value = codigoTecnicoGuardado;
        }
        
        actualizarListaSegmentos();
        actualizarSelectSegmentos();
        actualizarListaBloques();
        actualizarSelectBloques();
        actualizarListaComentarios();
        actualizarSelectComentarios();
        actualizarListaRegistros();
        actualizarEstadoBotones();
        actualizarContadorRegistros();
    }

    // Guardar código técnico cuando cambia
    elementos.codigoTecnico.addEventListener('input', function() {
        const valor = this.value.trim().toUpperCase();
        localStorage.setItem('codigoTecnico', valor);
    });

    // Funciones para actualizar las listas
    function actualizarListaSegmentos() {
        elementos.listaSegmentos.innerHTML = segmentos.length ? 
            segmentos.map((seg, i) => `
                <div class="segmento-item">
                    <span>${seg}</span>
                    <span class="segmento-borrar" data-index="${i}">×</span>
                </div>
            `).join('') : '<p>No hay segmentos agregados</p>';
        
        document.querySelectorAll('.segmento-borrar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`¿Eliminar el segmento "${segmentos[index]}"?`)) {
                    segmentos.splice(index, 1);
                    localStorage.setItem('segmentosPersonalizados', JSON.stringify(segmentos));
                    actualizarListaSegmentos();
                    actualizarSelectSegmentos();
                }
            });
        });
    }

    function actualizarListaBloques() {
        elementos.listaBloques.innerHTML = bloques.length ? 
            bloques.map((blq, i) => `
                <div class="segmento-item">
                    <span>${blq}</span>
                    <span class="segmento-borrar" data-index="${i}">×</span>
                </div>
            `).join('') : '<p>No hay bloques agregados</p>';
        
        document.querySelectorAll('.segmento-borrar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`¿Eliminar el bloque "${bloques[index]}"?`)) {
                    bloques.splice(index, 1);
                    localStorage.setItem('bloquesPersonalizados', JSON.stringify(bloques));
                    actualizarListaBloques();
                    actualizarSelectBloques();
                }
            });
        });
    }

    function actualizarListaComentarios() {
        elementos.listaComentarios.innerHTML = comentariosPredeterminados.length ? 
            comentariosPredeterminados.map((com, i) => `
                <div class="segmento-item">
                    <span>${com}</span>
                    <span class="segmento-borrar" data-index="${i}">×</span>
                </div>
            `).join('') : '<p>No hay comentarios predeterminados</p>';
        
        document.querySelectorAll('.segmento-borrar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`¿Eliminar el comentario "${comentariosPredeterminados[index]}"?`)) {
                    comentariosPredeterminados.splice(index, 1);
                    localStorage.setItem('comentariosPredeterminados', JSON.stringify(comentariosPredeterminados));
                    actualizarListaComentarios();
                    actualizarSelectComentarios();
                }
            });
        });
    }

    function actualizarSelectSegmentos() {
        elementos.selectSegmento.innerHTML = segmentos.length ? 
            segmentos.map(seg => `<option value="${seg}">${seg}</option>`).join('') : 
            '<option value="">-- Agregue segmentos primero --</option>';
        elementos.selectSegmento.disabled = segmentos.length === 0;
    }

    function actualizarSelectBloques() {
        elementos.selectBloque.innerHTML = bloques.length ? 
            bloques.map(blq => `<option value="${blq}">${blq}</option>`).join('') : 
            '<option value="">-- Agregue bloques primero --</option>';
        elementos.selectBloque.disabled = bloques.length === 0;
    }

    function actualizarSelectComentarios() {
        elementos.selectComentario.innerHTML = comentariosPredeterminados.length ? 
            ['<option value="">-- Seleccione un comentario --</option>']
            .concat(comentariosPredeterminados.map(com => `<option value="${com}">${com}</option>`))
            .join('') : 
            '<option value="">-- Agregue comentarios primero --</option>';
        elementos.selectComentario.disabled = comentariosPredeterminados.length === 0;
        elementos.comentarioPersonalizado.disabled = comentariosPredeterminados.length === 0 ? false : elementos.selectComentario.value !== '';
    }

    function actualizarListaRegistros() {
        elementos.listaRegistros.innerHTML = registros.length ? 
            registros.map((reg, i) => {
                let detalles = [];
                
                if (reg.comentarioPersonalizado) {
                    detalles.push(`Personalizado: ${reg.comentarioPersonalizado.substring(0, 20)}...`);
                } else if (reg.comentarioPredeterminado) {
                    detalles.push(`Predeterminado: ${reg.comentarioPredeterminado.substring(0, 20)}...`);
                }
                
                return `
                    <div class="registro-item">
                        <span>${reg.segmento}-${reg.bloque}-${reg.numeroEstructura}${detalles.length ? ' - ' + detalles.join(', ') : ''} - ${reg.fecha}</span>
                        <div class="registro-actions">
                            ${reg.comentarioPredeterminado ? `<button class="btn-eliminar-comentario btn-orange" data-index="${i}">Quitar Comentario</button>` : ''}
                            <button class="btn-eliminar btn-red" data-index="${i}">Eliminar</button>
                        </div>
                    </div>
                `;
            }).join('') : '<p>No hay registros guardados</p>';
        
        actualizarContadorRegistros();
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('¿Eliminar este registro?')) {
                    registros.splice(index, 1);
                    localStorage.setItem('registrosCalidad', JSON.stringify(registros));
                    actualizarListaRegistros();
                    actualizarEstadoBotones();
                }
            });
        });
        
        document.querySelectorAll('.btn-eliminar-comentario').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                registros[index].comentarioPredeterminado = '';
                localStorage.setItem('registrosCalidad', JSON.stringify(registros));
                actualizarListaRegistros();
            });
        });
    }

    function actualizarEstadoBotones() {
        elementos.btnGuardar.disabled = segmentos.length === 0 || bloques.length === 0;
        elementos.btnGenerar.disabled = registros.length === 0;
    }

    function actualizarContadorRegistros() {
        const contadorExistente = document.getElementById('contador-registros');
        
        if (contadorExistente) {
            contadorExistente.textContent = `Registros guardados: ${registros.length}`;
        } else {
            const contador = document.createElement('div');
            contador.id = 'contador-registros';
            contador.style.cssText = `
                position: fixed;
                bottom: 25px;
                right: 25px;
                background: #4CAF50;
                color: white;
                padding: 12px 18px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                z-index: 1000;
                font-size: 15px;
                font-weight: 500;
            `;
            contador.textContent = `Registros guardados: ${registros.length}`;
            document.body.appendChild(contador);
        }
    }

    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            background: #2196F3;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 14px;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => notificacion.remove(), 500);
        }, 2500);
    }

    // Evento para cambiar entre comentario personalizado y predeterminado
    elementos.selectComentario.addEventListener('change', function() {
        if (this.value) {
            elementos.comentarioPersonalizado.disabled = true;
            elementos.comentarioPersonalizado.value = '';
            elementos.quitarComentarioPred.disabled = false;
        } else {
            elementos.comentarioPersonalizado.disabled = false;
            elementos.quitarComentarioPred.disabled = true;
        }
    });

    // Evento para el botón de quitar comentario predeterminado
    elementos.quitarComentarioPred.addEventListener('click', function() {
        elementos.selectComentario.value = '';
        elementos.comentarioPersonalizado.disabled = false;
        this.disabled = true;
    });

    // Evento para comentario personalizado
    elementos.comentarioPersonalizado.addEventListener('input', function() {
        if (this.value) {
            elementos.selectComentario.disabled = true;
            elementos.selectComentario.value = '';
            elementos.quitarComentarioPred.disabled = true;
        } else {
            elementos.selectComentario.disabled = comentariosPredeterminados.length === 0;
        }
    });

    // Eventos para los botones
    elementos.agregarSegmento.addEventListener('click', function() {
        const nuevoSegmento = elementos.nuevoSegmento.value.trim().toUpperCase();
        if (!nuevoSegmento) return alert('Ingrese un código de segmento');
        
        if (!segmentos.includes(nuevoSegmento)) {
            segmentos.push(nuevoSegmento);
            segmentos.sort();
            localStorage.setItem('segmentosPersonalizados', JSON.stringify(segmentos));
            elementos.nuevoSegmento.value = '';
            actualizarListaSegmentos();
            actualizarSelectSegmentos();
            mostrarNotificacion('Segmento agregado correctamente');
        } else {
            alert('Este segmento ya existe');
        }
    });

    elementos.agregarBloque.addEventListener('click', function() {
        const nuevoBloque = elementos.nuevoBloque.value.trim();
        if (!nuevoBloque) return alert('Ingrese un número de bloque');
        
        if (!bloques.includes(nuevoBloque)) {
            bloques.push(nuevoBloque);
            bloques.sort((a, b) => a - b);
            localStorage.setItem('bloquesPersonalizados', JSON.stringify(bloques));
            elementos.nuevoBloque.value = '';
            actualizarListaBloques();
            actualizarSelectBloques();
            mostrarNotificacion('Bloque agregado correctamente');
        } else {
            alert('Este bloque ya existe');
        }
    });

    elementos.agregarComentario.addEventListener('click', function() {
        const nuevoComentario = elementos.nuevoComentario.value.trim();
        if (!nuevoComentario) return alert('Ingrese un comentario');
        
        if (!comentariosPredeterminados.includes(nuevoComentario)) {
            comentariosPredeterminados.push(nuevoComentario);
            localStorage.setItem('comentariosPredeterminados', JSON.stringify(comentariosPredeterminados));
            elementos.nuevoComentario.value = '';
            actualizarListaComentarios();
            actualizarSelectComentarios();
            mostrarNotificacion('Comentario agregado correctamente');
        } else {
            alert('Este comentario ya existe');
        }
    });

    elementos.btnGuardar.addEventListener('click', function() {
        const codigoTecnico = elementos.codigoTecnico.value.trim();
        const segmento = elementos.selectSegmento.value;
        const bloque = elementos.selectBloque.value;
        const numeroEstructura = elementos.numeroEstructura.value;
        const comentarioPersonalizado = elementos.comentarioPersonalizado.value.trim();
        const comentarioPredeterminado = elementos.selectComentario.value;
        
        if (!codigoTecnico) return alert('Ingrese su código de técnico');
        if (!segmento) return alert('Seleccione un segmento');
        if (!bloque) return alert('Seleccione un bloque');
        if (!numeroEstructura) return alert('Ingrese el número de estructura');
        if (!comentarioPersonalizado && !comentarioPredeterminado) {
            return alert('Ingrese al menos un comentario (personalizado o predeterminado)');
        }
        
        registros.push({
            codigoTecnico,
            segmento,
            bloque,
            numeroEstructura,
            comentarioPersonalizado: comentarioPersonalizado || null,
            comentarioPredeterminado: comentarioPredeterminado || null,
            fecha: new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit'
            })
        });
        
        localStorage.setItem('registrosCalidad', JSON.stringify(registros));
        actualizarListaRegistros();
        actualizarEstadoBotones();
        mostrarNotificacion('Registro guardado correctamente');
        
        // Limpiar campos
        elementos.numeroEstructura.value = '';
        elementos.comentarioPersonalizado.value = '';
        elementos.comentarioPersonalizado.disabled = false;
        elementos.selectComentario.value = '';
        elementos.quitarComentarioPred.disabled = true;
        elementos.selectComentario.disabled = comentariosPredeterminados.length === 0;
    });

    elementos.btnGenerar.addEventListener('click', function() {
        if (registros.length === 0) return alert('No hay registros para generar');
        
        const tecnicos = [...new Set(registros.map(r => r.codigoTecnico))];
        const segmentosTrab = [...new Set(registros.map(r => r.segmento))].sort();
        const bloquesTrab = [...new Set(registros.map(r => r.bloque))].sort((a, b) => a - b);
        
        let contenido = `REPORTE DE CONTROL DE CALIDAD\n${'-'.repeat(40)}\n\n`;
        contenido += `FECHA: ${new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}\n`;
        contenido += `TÉCNICO: ${tecnicos.join(', ')}\n`;
        contenido += `SEGMENTOS TRABAJADOS: ${segmentosTrab.join(', ')}\n`;
        contenido += `BLOQUES TRABAJADOS: ${bloquesTrab.join(', ')}\n\n`;
        contenido += 'DETALLE DE REGISTROS:\n\n';
        
        registros.forEach((reg, i) => {
            contenido += `REGISTRO ${i + 1}:\n`;
            contenido += `Código: ${reg.segmento}-${reg.bloque}-${reg.numeroEstructura}\n`;
            
            if (reg.comentarioPersonalizado) {
                contenido += `Comentario Personalizado: ${reg.comentarioPersonalizado}\n`;
            }
            
            if (reg.comentarioPredeterminado) {
                contenido += `Comentario Predeterminado: ${reg.comentarioPredeterminado}\n`;
            }
            
            contenido += `Fecha: ${reg.fecha}\n\n`;
        });
        
        // Resumen estadístico
        contenido += 'RESUMEN ESTADÍSTICO:\n';
        contenido += `${'-'.repeat(40)}\n`;
        contenido += `Total de estructuras revisadas: ${registros.length}\n`;
        contenido += `Segmentos trabajados: ${segmentosTrab.length}\n`;
        contenido += `Bloques trabajados: ${bloquesTrab.length}\n`;
        contenido += `${'-'.repeat(40)}\n`;
        
        // Mostrar y descargar
        elementos.output.textContent = contenido;
        const blob = new Blob(["\uFEFF" + contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `control_calidad_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
    });

    elementos.btnLimpiar.addEventListener('click', function() {
        if (confirm('¿Eliminar TODOS los registros?')) {
            registros = [];
            localStorage.removeItem('registrosCalidad');
            actualizarListaRegistros();
            elementos.output.textContent = '';
            actualizarEstadoBotones();
            mostrarNotificacion('Todos los registros han sido eliminados');
        }
    });

    // Inicialización
    cargarDatosIniciales();
});