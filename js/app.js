import { authService } from './auth/authService.js';
import { apiService } from './api/apiService.js';
import { characterService } from './characters/characterService.js';
import { episodeService } from './episodes/episodeService.js';
import { uiService } from './ui/uiService.js'; 

const pantallaLogin = document.getElementById('login-view');
const pantallaRegistro = document.getElementById('register-view');
const pantallaRecuperacion = document.getElementById('recovery-view');
const pantallaPersonajes = document.getElementById('characters-view');
const pantallaEpisodios = document.getElementById('episodes-view');

const pasoSeguridadRecuperacion = document.getElementById('security-step');
const etiquetaPregunta = document.getElementById('security-question-label');
const botonAccionRecuperacion = document.getElementById('btn-recovery-action');
let usuarioEnRecuperacion = '';

const cuerpoTablaPersonajes = document.getElementById('characters-table-body');
const buscadorPersonajes = document.getElementById('character-search');
const modalPersonaje = document.getElementById('character-modal');
const botonCerrarModal = document.getElementById('close-modal-btn');
const formularioEditarPersonaje = document.getElementById('edit-character-form');
const botonGuardarPersonaje = document.getElementById('modal-char-save-btn'); 

const cuerpoTablaEpisodios = document.getElementById('episodes-table-body');
const buscadorEpisodios = document.getElementById('episode-search');
const modalEpisodio = document.getElementById('episode-modal');
const botonCerrarModalEpi = document.getElementById('close-episode-modal-btn');
const formularioEditarEpisodio = document.getElementById('edit-episode-form');
const botonGuardarEpisodio = document.getElementById('modal-epi-save-btn'); 
const interruptorTema = document.getElementById('theme-toggle');
const barraAlertaOffline = document.getElementById('offline-toast');

uiService.inicializarTema(interruptorTema);
uiService.comprobarEstadoRed(barraAlertaOffline);

interruptorTema.addEventListener('change', function() {
    uiService.alternarTema(interruptorTema.checked);
});

window.addEventListener('online', function() {
    uiService.comprobarEstadoRed(barraAlertaOffline);
});
window.addEventListener('offline', function() {
    uiService.comprobarEstadoRed(barraAlertaOffline);
});

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

document.querySelectorAll('.btn-nav-characters').forEach(function(boton) {
    boton.addEventListener('click', function() {
        pantallaEpisodios.classList.add('oculto');     
        pantallaPersonajes.classList.remove('oculto'); 
    });
});

document.querySelectorAll('.btn-nav-episodes').forEach(function(boton) {
    boton.addEventListener('click', function() {
        pantallaPersonajes.classList.add('oculto');    
        pantallaEpisodios.classList.remove('oculto');  
    });
});

document.querySelectorAll('.btn-logout').forEach(function(boton) {
    boton.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            
            pantallaPersonajes.classList.add('oculto');
            pantallaEpisodios.classList.add('oculto');
            
            document.getElementById('login-form').reset();
            
            pantallaLogin.classList.remove('oculto');
            
        }
    });
});

document.getElementById('login-form').addEventListener('submit', async function(evento) {
    evento.preventDefault();
    const usuarioEscrito = document.getElementById('login-username').value;
    const claveEscrita = document.getElementById('login-password').value;

    try {
        authService.login(usuarioEscrito, claveEscrita);
        alert('¡Inicio de sesión con éxito! Cargando el sistema...');
        
        pantallaLogin.classList.add('oculto');
        pantallaPersonajes.classList.remove('oculto');
        
        const personajesDeInternet = await apiService.obtenerPersonajesDeInternet();
        characterService.inicializarPersonajes(personajesDeInternet);
        pintarTablaPersonajes(characterService.personajesEnMemoria);

        const episodiosDeInternet = await apiService.obtenerEpisodiosDeInternet();
        episodeService.inicializarEpisodios(episodiosDeInternet);
        pintarTablaEpisodios(episodeService.episodiosEnMemoria);

    } catch (error) {
        alert(error.message);
    }
});

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

function pintarTablaPersonajes(listaDePersonajes) {
    cuerpoTablaPersonajes.innerHTML = '';

    for (let i = 0; i < listaDePersonajes.length; i++) {
        const p = listaDePersonajes[i];
        const filaHtml = `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>${p.name}</td>
                <td><span class="badge-especie">${p.species}</span></td>
                <td>${p.gender}</td>
                <td>${p.type || 'Ninguno'}</td>
                <td>
                    <div class="actions-cell-container">
                        <button class="btn-ver-detalle" data-id="${p.id}">Ver Detalle</button>
                        <button class="btn-editar-ficha" data-id="${p.id}">Editar</button>
                    </div>
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
    document.querySelectorAll('.btn-ver-detalle').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const personajeSeleccionado = characterService.personajesEnMemoria.find(function(p) {
                return p.id === idBuscar;
            });
            
            if (personajeSeleccionado) {
                document.getElementById('modal-char-id').value = personajeSeleccionado.id;
                document.getElementById('modal-char-img').src = personajeSeleccionado.image || '';
                document.getElementById('modal-char-name').value = personajeSeleccionado.name;
                document.getElementById('modal-char-species').value = personajeSeleccionado.species;
                document.getElementById('modal-char-gender').value = personajeSeleccionado.gender;
                document.getElementById('modal-char-type').value = personajeSeleccionado.type || '';

                document.getElementById('modal-char-name').disabled = true;
                document.getElementById('modal-char-species').disabled = true;
                document.getElementById('modal-char-gender').disabled = true;
                document.getElementById('modal-char-type').disabled = true;

                botonGuardarPersonaje.classList.add('oculto');

                modalPersonaje.classList.remove('oculto');
            }
        });
    });

    document.querySelectorAll('.btn-editar-ficha').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const personajeSeleccionado = characterService.personajesEnMemoria.find(function(p) {
                return p.id === idBuscar;
            });
            
            if (personajeSeleccionado) {
                document.getElementById('modal-char-id').value = personajeSeleccionado.id;
                document.getElementById('modal-char-img').src = personajeSeleccionado.image || '';
                document.getElementById('modal-char-name').value = personajeSeleccionado.name;
                document.getElementById('modal-char-species').value = personajeSeleccionado.species;
                document.getElementById('modal-char-gender').value = personajeSeleccionado.gender;
                document.getElementById('modal-char-type').value = personajeSeleccionado.type || '';

                document.getElementById('modal-char-name').disabled = false;
                document.getElementById('modal-char-species').disabled = false;
                document.getElementById('modal-char-gender').disabled = false;
                document.getElementById('modal-char-type').disabled = false;

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


function pintarTablaEpisodios(listaDeEpisodios) {
    cuerpoTablaEpisodios.innerHTML = '';

    for (let i = 0; i < listaDeEpisodios.length; i++) {
        const e = listaDeEpisodios[i];
        const filaHtml = `
            <tr>
                <td><strong>#${e.id}</strong></td>
                <td>${e.name}</td>
                <td>${e.air_date}</td>
                <td><span class="badge-codigo">${e.episode}</span></td>
                <td>
                    <div class="actions-cell-container">
                        <button class="btn-ver-detalle-epi" data-id="${e.id}">Ver Detalle</button>
                        <button class="btn-editar-ficha-epi" data-id="${e.id}">Editar</button>
                    </div>
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
    document.querySelectorAll('.btn-ver-detalle-epi').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const episodioSeleccionado = episodeService.episodiosEnMemoria.find(function(e) {
                return e.id === idBuscar;
            });
            
            if (episodioSeleccionado) {
                document.getElementById('modal-epi-id').value = episodioSeleccionado.id;
                document.getElementById('modal-epi-name').value = episodioSeleccionado.name;
                document.getElementById('modal-epi-date').value = episodioSeleccionado.air_date;
                document.getElementById('modal-epi-code').value = episodioSeleccionado.episode;

                document.getElementById('modal-epi-name').disabled = true;
                document.getElementById('modal-epi-date').disabled = true;
                document.getElementById('modal-epi-code').disabled = true;

                botonGuardarEpisodio.classList.add('oculto');

                modalEpisodio.classList.remove('oculto');
            }
        });
    });

    document.querySelectorAll('.btn-editar-ficha-epi').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const idBuscar = Number(boton.getAttribute('data-id'));
            const episodioSeleccionado = episodeService.episodiosEnMemoria.find(function(e) {
                return e.id === idBuscar;
            });
            
            if (episodioSeleccionado) {
                document.getElementById('modal-epi-id').value = episodioSeleccionado.id;
                document.getElementById('modal-epi-name').value = episodioSeleccionado.name;
                document.getElementById('modal-epi-date').value = episodioSeleccionado.air_date;
                document.getElementById('modal-epi-code').value = episodioSeleccionado.episode;

                document.getElementById('modal-epi-name').disabled = false;
                document.getElementById('modal-epi-date').disabled = false;
                document.getElementById('modal-epi-code').disabled = false;

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
