// js/ui/uiService.js

// Esta es nuestra caja de herramientas lógicas para controlar la apariencia y el estado de la red
export const uiService = {

    // ==========================================
    // TAREA 1: TEMATIZACIÓN DUAL (LIGHT / DARK)
    // ==========================================
    
    // Configura el color de la página al abrir la aplicación leyendo lo que guardamos en el pasado
    inicializarTema(interruptorHtml) {
        // Vamos a la gaveta del navegador (localStorage) a buscar si guardamos un tema preferido
        const temaGuardado = localStorage.getItem('tema_preferido');

        // Si el usuario tenía activado el modo oscuro la última vez...
        if (temaGuardado === 'dark') {
            // Le añadimos la etiqueta "dark" a la raíz del HTML para que cambien las variables CSS
            document.documentElement.setAttribute('data-theme', 'dark');
            // Dejamos el interruptor de la pantalla encendido (marcado)
            interruptorHtml.checked = true;
        } else {
            // Si no, forzamos a que la página inicie con colores claros
            document.documentElement.setAttribute('data-theme', 'light');
            // Dejamos el interruptor de la pantalla apagado (desmarcado)
            interruptorHtml.checked = false;
        }
    },

    // Cambia el color actual de la aplicación y lo guarda permanentemente para la próxima visita
    alternarTema(interruptorEncendido) {
        // Si el interruptor de la pantalla está encendido...
        if (interruptorEncendido === true) {
            // Activamos los colores oscuros modificando la propiedad del HTML
            document.documentElement.setAttribute('data-theme', 'dark');
            // Guardamos la palabra "dark" en la gaveta para recordarlo después
            localStorage.setItem('tema_preferido', 'dark');
        } else {
            // Si el interruptor está apagado, activamos los colores claros
            document.documentElement.setAttribute('data-theme', 'light');
            // Guardamos la palabra "light" en la gaveta
            localStorage.setItem('tema_preferido', 'light');
        }
    },

    // ==========================================
    // TAREA 2: RESILIENCIA Y MODO OFFLINE
    // ==========================================
    
    // Revisa si el navegador tiene o perdió la conexión a internet en este instante
    comprobarEstadoRed(alertaOfflineHtml) {
        // navigator.onLine es una herramienta del navegador que nos da true (si hay internet) o false (si no hay)
        if (navigator.onLine === false) {
            // Si no hay internet, removemos la clase que oculta la barra para que el usuario vea la advertencia
            alertaOfflineHtml.classList.remove('oculto-total');
        } else {
            // Si el internet regresó o está bien, le volvemos a poner la clase para esconder la barra
            alertaOfflineHtml.classList.add('oculto-total');
        }
    }

};