// js/app.js

// ==========================================================================
// IMPORTACIONES: Conectamos las herramientas de nuestros archivos de servicio
// ==========================================================================
import { authService } from './auth/authService.js';
import { apiService } from './api/apiService.js';
import { characterService } from './characters/characterService.js';
import { episodeService } from './episodes/episodeService.js';
import { uiService } from './ui/uiService.js'; // <-- ¡Nueva herramienta visual y de red!

// ==========================================================================
// PANTALLAS PRINCIPALES DEL HTML
// ==========================================================================
const pantallaLogin = document.getElementById('login-view');
const pantallaRegistro = document.getElementById('register-view');
const pantallaRecuperacion = document.getElementById('recovery-view');
const pantallaPersonajes = document.getElementById('characters-view');
const pantallaEpisodios = document.getElementById('episodes-view');

// Elementos internos de la recuperación de contraseña
const pasoSeguridadRecuperacion = document.getElementById('security-step');
const etiquetaPregunta = document.getElementById('security-question-label');
const botonAccionRecuperacion = document.getElementById('btn-recovery-action');
let usuarioEnRecuperacion = '';

// Elementos internos de la gestión de personajes (Módulo 2)
const cuerpoTablaPersonajes = document.getElementById('characters-table-body');
const buscadorPersonajes = document.getElementById('character-search');
const modalPersonaje = document.getElementById('character-modal');
const botonCerrarModal = document.getElementById('close-modal-btn');
const formularioEditarPersonaje = document.getElementById('edit-character-form');
const botonGuardarPersonaje = document.getElementById('modal-char-save-btn'); // <-- ¡AGREGA ESTA LÍNEA!

// Elementos internos de la gestión de episodios (Módulo 3)
const cuerpoTablaEpisodios = document.getElementById('episodes-table-body');
const buscadorEpisodios = document.getElementById('episode-search');
const modalEpisodio = document.getElementById('episode-modal');
const botonCerrarModalEpi = document.getElementById('close-episode-modal-btn');
const formularioEditarEpisodio = document.getElementById('edit-episode-form');
const botonGuardarEpisodio = document.getElementById('modal-epi-save-btn'); // <-- ¡AGREGA ESTA LÍNEA!
// NUEVOS ELEMENTOS DE INTERFAZ Y RED (Módulo 4)
const interruptorTema = document.getElementById('theme-toggle');
const barraAlertaOffline = document.getElementById('offline-toast');

// ==========================================================================
// CONFIGURACIÓN INICIAL AUTOMÁTICA (APARIENCIA Y RED)
// ==========================================================================
// Al abrir la app, revisamos qué tema prefiere el usuario y si tiene internet
uiService.inicializarTema(interruptorTema);
uiService.comprobarEstadoRed(barraAlertaOffline);

// Escuchamos si el usuario activa o desactiva el interruptor de modo oscuro
interruptorTema.addEventListener('change', function() {
    uiService.alternarTema(interruptorTema.checked);
});

// Escuchamos de forma automática si la computadora pierde o recupera la señal de internet
window.addEventListener('online', function() {
    uiService.comprobarEstadoRed(barraAlertaOffline);
});
window.addEventListener('offline', function() {
    uiService.comprobarEstadoRed(barraAlertaOffline);
});

// ==========================================================================
// ENLACES DE NAVEGACIÓN (CAMBIAR DE PANTALLA)
// ==========================================================================
document.getElementById('go-to-register').addEventListener('click', function() {
    pantallaLogin.classList.add('oculto');
    pantallaRegistro.classList.remove('oculto');
});

document.getElementById('go-to-recovery').addEventListener('click', function() {
    pantallaLogin.classList.add('oculto');
    pantallaRecuperacion.classList.remove('oculto');
});

document.getElementById('go-to-login-from-reg').addEventListener('click', function() {
    pantallaRegistro.classList.add('oculto');
    pantallaLogin.classList.remove('oculto');
});

document.getElementById('go-to-login-from-rec').addEventListener('click', function() {
    pantallaRecuperacion.classList.add('oculto');
    pasoSeguridadRecuperacion.classList.add('oculto');
    botonAccionRecuperacion.textContent = 'Verificar Cuenta';
    pantallaLogin.classList.remove('oculto');
});

// ==========================================================================
// ENLACES DE NAVEGACIÓN CORREGIDOS
// ==========================================================================

// Lógica para que todos los botones de personajes funcionen
document.querySelectorAll('.btn-nav-characters').forEach(function(boton) {
    boton.addEventListener('click', function() {
        pantallaEpisodios.classList.add('oculto');     // Esconde episodios
        pantallaPersonajes.classList.remove('oculto'); // Muestra personajes
    });
});

// Lógica para que todos los botones de episodios funcionen
document.querySelectorAll('.btn-nav-episodes').forEach(function(boton) {
    boton.addEventListener('click', function() {
        pantallaPersonajes.classList.add('oculto');    // Esconde personajes
        pantallaEpisodios.classList.remove('oculto');  // Muestra episodios
    });
});

// Lógica para que todos los botones de Cerrar Sesión funcionen
document.querySelectorAll('.btn-logout').forEach(function(boton) {
    boton.addEventListener('click', function() {
        // 1. Preguntar al usuario si está seguro (Opcional pero recomendado)
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            
            // 2. Esconder las pantallas del sistema interno
            pantallaPersonajes.classList.add('oculto');
            pantallaEpisodios.classList.add('oculto');
            
            // 3. Limpiar los campos del formulario de login por seguridad
            document.getElementById('login-form').reset();
            
            // 4. Mostrar la pantalla de inicio de sesión
            pantallaLogin.classList.remove('oculto');
            
            // 5. (Opcional) Si tu authService requiere limpiar tokens o sesiones locales:
            // authService.logout(); 
        }
    });
});


// ==========================================================================
// ACCIONES DEL MÓDULO 1: AUTENTICACIÓN
// ==========================================================================

// Iniciar Sesión (Login)
document.getElementById('login-form').addEventListener('submit', async function(evento) {
    evento.preventDefault();
    const usuarioEscrito = document.getElementById('login-username').value;
    const claveEscrita = document.getElementById('login-password').value;

    try {
        authService.login(usuarioEscrito, claveEscrita);
        alert('¡Inicio de sesión con éxito! Cargando el sistema...');
        
        pantallaLogin.classList.add('oculto');
        pantallaPersonajes.classList.remove('oculto');
        
        // DESCARGA INICIAL DE PERSONAJES
        const personajesDeInternet = await apiService.obtenerPersonajesDeInternet();
        characterService.inicializarPersonajes(personajesDeInternet);
        pintarTablaPersonajes(characterService.personajesEnMemoria);

        // DESCARGA INICIAL DE EPISODIOS
        const episodiosDeInternet = await apiService.obtenerEpisodiosDeInternet();
        episodeService.inicializarEpisodios(episodiosDeInternet);
        pintarTablaEpisodios(episodeService.episodiosEnMemoria);

    } catch (error) {
        alert(error.message);
    }
});

// Registrar un Usuario Nuevo
document.getElementById('register-form').addEventListener('submit', function(evento) {
    evento.preventDefault();
    const usuario = document.getElementById('reg-username').value;
    const correo = document.getElementById('reg-email').value;
    const clave = document.getElementById('reg-password').value;
    const pregunta = document.getElementById('reg-question').value;
    const respuesta = document.getElementById('reg-answer').value;

    try {
        authService.register(usuario, correo, clave, pregunta, respuesta);
        alert('Usuario registrado con éxito. Ya puedes iniciar sesión.');
        pantallaRegistro.classList.add('oculto');
        pantallaLogin.classList.remove('oculto');
    } catch (error) {
        alert(error.message);
    }
});

// Recuperar Contraseña Vieja
document.getElementById('recovery-form').addEventListener('submit', function(evento) {
    evento.preventDefault();

    if (usuarioEnRecuperacion === '') {
        const usuarioBuscar = document.getElementById('recover-username').value;
        try {
            const datosUsuario = authService.findUserForRecovery(usuarioBuscar);
            usuarioEnRecuperacion = datosUsuario.username;
            etiquetaPregunta.textContent = `Tu pregunta es: ¿Cuál es tu ${datosUsuario.question}?`;
            pasoSeguridadRecuperacion.classList.remove('oculto');
            botonAccionRecuperacion.textContent = 'Cambiar Contraseña';
        } catch (error) {
            alert(error.message);
        }
    } else {
        const respuestaEscrita = document.getElementById('recover-answer').value;
        const nuevaClave = document.getElementById('new-password').value;

        try {
            authService.resetPassword(usuarioEnRecuperacion, respuestaEscrita, nuevaClave);
            alert('Contraseña cambiada con éxito.');
            usuarioEnRecuperacion = '';
            pasoSeguridadRecuperacion.classList.add('oculto');
            botonAccionRecuperacion.textContent = 'Verificar Cuenta';
            pantallaRecuperacion.classList.add('oculto');
            pantallaLogin.classList.remove('oculto');
        } catch (error) {
            alert(error.message);
        }
    }
});


// ==========================================================================
// ACCIONES DEL MÓDULO 2: GESTIÓN DE PERSONAJES
// ==========================================================================

function pintarTablaPersonajes(listaDePersonajes) {
    cuerpoTablaPersonajes.innerHTML = '';

    for (let i = 0; i < listaDePersonajes.length; i++) {
        const p = listaDePersonajes[i];
        const filaHtml = `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.species}</td>
                <td>${p.gender}</td>
                <td>${p.type || 'Ninguno'}</td>
                <td>
                    <!-- Botones con clases y acciones totalmente separadas -->
                    <button class="btn-ver-detalle" data-id="${p.id}" style="background-color: #00b0c8; margin-right: 5px;">Ver Detalle</button>
                    <button class="btn-editar-ficha" data-id="${p.id}" style="background-color: #1bc43b;">Editar</button>
                </td>
            </tr>
        `;
        cuerpoTablaPersonajes.insertAdjacentHTML('beforeend', filaHtml);
    }
    asignarEventosABotonesDeFichaPersonajes();
}

buscadorPersonajes.addEventListener('input', function() {
    const textoEscrito = buscadorPersonajes.value;
    const personajesFiltrados = characterService.buscarPorNombre(textoEscrito);
    pintarTablaPersonajes(personajesFiltrados);
});

document.querySelectorAll('#characters-table th').forEach(function(titulo) {
    titulo.addEventListener('click', function() {
        const nombreColumna = titulo.getAttribute('data-columna');
        if (nombreColumna === null) return;

        const textoEscrito = buscadorPersonajes.value;
        let listaAOrdenrar = characterService.buscarPorNombre(textoEscrito);

        const listaOrdenada = characterService.ordenarPersonajes(listaAOrdenrar, nombreColumna);
        pintarTablaPersonajes(listaOrdenada);
    });
});

function asignarEventosABotonesDeFichaPersonajes() {
    // ACCIÓN 1: PRESIONAR "VER DETALLE"
    document.querySelectorAll('.btn-ver-detalle').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const personajeSeleccionado = characterService.personajesEnMemoria.find(function(p) {
                return p.id === idBuscar;
            });
            
            if (personajeSeleccionado) {
                // Rellenamos los campos del formulario
                document.getElementById('modal-char-id').value = personajeSeleccionado.id;
                document.getElementById('modal-char-img').src = personajeSeleccionado.image || '';
                document.getElementById('modal-char-name').value = personajeSeleccionado.name;
                document.getElementById('modal-char-species').value = personajeSeleccionado.species;
                document.getElementById('modal-char-gender').value = personajeSeleccionado.gender;
                document.getElementById('modal-char-type').value = personajeSeleccionado.type || '';

                // Bloqueamos los campos para que NO se puedan editar
                document.getElementById('modal-char-name').disabled = true;
                document.getElementById('modal-char-species').disabled = true;
                document.getElementById('modal-char-gender').disabled = true;
                document.getElementById('modal-char-type').disabled = true;

                // OCULTAMOS el botón de Guardar Cambios
                botonGuardarPersonaje.classList.add('oculto');

                modalPersonaje.classList.remove('oculto');
            }
        });
    });

    // ACCIÓN 2: PRESIONAR "EDITAR"
    document.querySelectorAll('.btn-editar-ficha').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const personajeSeleccionado = characterService.personajesEnMemoria.find(function(p) {
                return p.id === idBuscar;
            });
            
            if (personajeSeleccionado) {
                // Rellenamos los campos del formulario
                document.getElementById('modal-char-id').value = personajeSeleccionado.id;
                document.getElementById('modal-char-img').src = personajeSeleccionado.image || '';
                document.getElementById('modal-char-name').value = personajeSeleccionado.name;
                document.getElementById('modal-char-species').value = personajeSeleccionado.species;
                document.getElementById('modal-char-gender').value = personajeSeleccionado.gender;
                document.getElementById('modal-char-type').value = personajeSeleccionado.type || '';

                // Desbloqueamos los campos para que SÍ se puedan editar
                document.getElementById('modal-char-name').disabled = false;
                document.getElementById('modal-char-species').disabled = false;
                document.getElementById('modal-char-gender').disabled = false;
                document.getElementById('modal-char-type').disabled = false;

                // MOSTRAMOS el botón de Guardar Cambios
                botonGuardarPersonaje.classList.remove('oculto');

                modalPersonaje.classList.remove('oculto');
            }
        });
    });
}

botonCerrarModal.addEventListener('click', function() {
    modalPersonaje.classList.add('oculto');
});

formularioEditarPersonaje.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const id = document.getElementById('modal-char-id').value;
    const nombre = document.getElementById('modal-char-name').value;
    const especie = document.getElementById('modal-char-species').value;
    const genero = document.getElementById('modal-char-gender').value;
    const tipo = document.getElementById('modal-char-type').value;

    characterService.guardarEdicion(id, nombre, especie, genero, tipo);
    alert('Ficha del personaje guardada y actualizada con éxito.');

    modalPersonaje.classList.add('oculto');
    pintarTablaPersonajes(characterService.personajesEnMemoria);
});


// ==========================================================================
// ACCIONES DEL MÓDULO 3: GESTIÓN DE EPISODIOS
// ==========================================================================
function pintarTablaEpisodios(listaDeEpisodios) {
    cuerpoTablaEpisodios.innerHTML = '';

    for (let i = 0; i < listaDeEpisodios.length; i++) {
        const e = listaDeEpisodios[i];
        const filaHtml = `
            <tr>
                <td>${e.id}</td>
                <td>${e.name}</td>
                <td>${e.air_date}</td>
                <td>${e.episode}</td>
                <td>
                    <!-- CLASES CORREGIDAS: btn-ver-detalle-epi y btn-editar-ficha-epi -->
                    <button class="btn-ver-detalle-epi" data-id="${e.id}" style="background-color: #00b0c8; margin-right: 5px;">Ver Detalle</button>
                    <button class="btn-editar-ficha-epi" data-id="${e.id}" style="background-color: #1bc43b;">Editar</button>
                </td>
            </tr>
        `;
        cuerpoTablaEpisodios.insertAdjacentHTML('beforeend', filaHtml);
    }
    asignarEventosABotonesDeFichaEpisodios();
}

buscadorEpisodios.addEventListener('input', function() {
    const textoEscrito = buscadorEpisodios.value;
    const episodiosFiltrados = episodeService.buscarPorNombre(textoEscrito);
    pintarTablaEpisodios(episodiosFiltrados);
});

document.querySelectorAll('#episodes-table th').forEach(function(titulo) {
    titulo.addEventListener('click', function() {
        const nombreColumna = titulo.getAttribute('data-columna');
        if (nombreColumna === null) return;

        const textoEscrito = buscadorEpisodios.value;
        let listaAOrganizar = episodeService.buscarPorNombre(textoEscrito);

        const listaOrdenada = episodeService.ordenarEpisodios(listaAOrganizar, nombreColumna);
        pintarTablaEpisodios(listaOrdenada);
    });
});

function asignarEventosABotonesDeFichaEpisodios() {
    // ACCIÓN 1: PRESIONAR "VER DETALLE"
    document.querySelectorAll('.btn-ver-detalle-epi').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const episodioSeleccionado = episodeService.episodiosEnMemoria.find(function(e) {
                return e.id === idBuscar;
            });
            
            if (episodioSeleccionado) {
                // Rellenamos los campos del formulario
                document.getElementById('modal-epi-id').value = episodioSeleccionado.id;
                document.getElementById('modal-epi-name').value = episodioSeleccionado.name;
                document.getElementById('modal-epi-date').value = episodioSeleccionado.air_date;
                document.getElementById('modal-epi-code').value = episodioSeleccionado.episode;

                // Bloqueamos los campos para que NO se puedan modificar
                document.getElementById('modal-epi-name').disabled = true;
                document.getElementById('modal-epi-date').disabled = true;
                document.getElementById('modal-epi-code').disabled = true;

                // OCULTAMOS el botón de Guardar Cambios
                botonGuardarEpisodio.classList.add('oculto');

                modalEpisodio.classList.remove('oculto');
            }
        });
    });

    // ACCIÓN 2: PRESIONAR "EDITAR"
    document.querySelectorAll('.btn-editar-ficha-epi').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const episodioSeleccionado = episodeService.episodiosEnMemoria.find(function(e) {
                return e.id === idBuscar;
            });
            
            if (episodioSeleccionado) {
                // Rellenamos los campos del formulario
                document.getElementById('modal-epi-id').value = episodioSeleccionado.id;
                document.getElementById('modal-epi-name').value = episodioSeleccionado.name;
                document.getElementById('modal-epi-date').value = episodioSeleccionado.air_date;
                document.getElementById('modal-epi-code').value = episodioSeleccionado.episode;

                // Desbloqueamos los campos para que SÍ se puedan editar
                document.getElementById('modal-epi-name').disabled = false;
                document.getElementById('modal-epi-date').disabled = false;
                document.getElementById('modal-epi-code').disabled = false;

                // MOSTRAMOS el botón de Guardar Cambios
                botonGuardarEpisodio.classList.remove('oculto');

                modalEpisodio.classList.remove('oculto');
            }
        });
    });
}

botonCerrarModalEpi.addEventListener('click', function() {
    modalEpisodio.classList.add('oculto');
});

formularioEditarEpisodio.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const id = document.getElementById('modal-epi-id').value;
    const nombre = document.getElementById('modal-epi-name').value;
    const fecha = document.getElementById('modal-epi-date').value;
    const codigo = document.getElementById('modal-epi-code').value;

    episodeService.guardarEdicion(id, nombre, fecha, codigo);
    alert('Ficha del episodio guardada con éxito.');

    modalEpisodio.classList.add('oculto');
    pintarTablaEpisodios(episodeService.episodiosEnMemoria);
});