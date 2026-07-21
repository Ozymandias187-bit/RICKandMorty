export const uiService = {

    inicializarTema(interruptorHtml) {
        const temaGuardado = localStorage.getItem('tema_preferido');

        if (temaGuardado === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            interruptorHtml.checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            interruptorHtml.checked = false;
        }
    },

    alternarTema(interruptorEncendido) {
        if (interruptorEncendido === true) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('tema_preferido', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('tema_preferido', 'light');
        }
    },

    comprobarEstadoRed(alertaOfflineHtml) {
        if (navigator.onLine === false) {
            alertaOfflineHtml.classList.remove('oculto-total');
        } else {
            alertaOfflineHtml.classList.add('oculto-total');
        }
    }

};
