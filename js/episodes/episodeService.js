// js/episodes/episodeService.js

// Esta es nuestra caja de herramientas lógicas para organizar y editar los episodios
export const episodeService = {
    
    // VARIABLES DE MEMORIA (Guardan la información de los episodios mientras la app está abierta)
    episodiosEnMemoria: [],
    columnaOrdenadaActual: '',
    ordenAscendente: true,

    // 1. CONFIGURACIÓN INICIAL: Junta los episodios de internet con los que hayas editado antes
    inicializarEpisodios(episodiosApi) {
        // Vamos a la gaveta del navegador (localStorage) a buscar si editamos episodios en el pasado
        const edicionesLocales = JSON.parse(localStorage.getItem('episodios_editados')) || {};
        
        // Recorremos la lista que llegó de internet uno por uno
        this.episodiosEnMemoria = episodiosApi.map(function(episodio) {
            // Si el ID de este episodio tiene una edición guardada en la gaveta...
            if (edicionesLocales[episodio.id]) {
                // Combinamos los datos originales de internet con los cambios editados localmente
                return Object.assign({}, episodio, edicionesLocales[episodio.id]);
            }
            // Si no ha sido editado, lo dejamos tal cual como llegó de internet
            return episodio;
        });
    },

    // 2. BUSCADOR EN TIEMPO REAL: Filtra los episodios según el nombre que escribas
    buscarPorNombre(textoCajaDeBusqueda) {
        const textoLimpio = textoCajaDeBusqueda.toLowerCase().trim();
        
        // Filtramos la lista en memoria dejando pasar solo los episodios que incluyan el texto escrito
        return this.episodiosEnMemoria.filter(function(episodio) {
            return episodio.name.toLowerCase().includes(textoLimpio);
        });
    },

    // 3. ORDENAMIENTO DE COLUMNAS: Ordena la tabla (A-Z o Z-A) al hacer clic en los títulos
    ordenarEpisodios(listaAOrganizar, nombreColumna) {
        // Si haces clic en la misma columna de antes, invertimos el orden. Si es nueva, va de menor a mayor.
        if (this.columnaOrdenadaActual === nombreColumna) {
            this.ordenAscendente = !this.ordenAscendente;
        } else {
            this.columnaOrdenadaActual = nombreColumna;
            this.ordenAscendente = true;
        }

        // Guardamos el estado del orden en una variable corta para usar dentro de la función de abajo
        const direccionOrden = this.ordenAscendente;

        // Estructura de ordenamiento clásica
        return listaAOrganizar.sort(function(elementoA, elementoB) {
            let valorA = elementoA[nombreColumna];
            let valorB = elementoB[nombreColumna];

            // Si estamos ordenando por la columna ID, los comparamos como números matemáticos
            if (nombreColumna === 'id') {
                if (direccionOrden === true) {
                    return valorA - valorB;
                } else {
                    return valorB - valorA;
                }
            }

            // Si son columnas de texto (Nombre, Fecha, Código), las pasamos a minúsculas para comparar bien
            valorA = String(valorA).toLowerCase();
            valorB = String(valorB).toLowerCase();

            if (valorA < valorB) {
                if (direccionOrden === true) {
                    return -1;
                } else {
                    return 1;
                }
            }
            if (valorA > valorB) {
                if (direccionOrden === true) {
                    return 1;
                } else {
                    return -1;
                }
            }
            return 0; // Si son totalmente iguales, no se mueven de posición
        });
    },

    // 4. GUARDAR EDICIÓN: Modifica los datos del episodio en la memoria y en la gaveta del navegador
    guardarEdicion(idRecibido, nuevoNombre, nuevaFecha, nuevoCodigo) {
        const numeroId = Number(idRecibido);
        
        // PASO A: Buscar al episodio en la memoria de la aplicación y actualizar sus datos
        for (let i = 0; i < this.episodiosEnMemoria.length; i++) {
            if (this.episodiosEnMemoria[i].id === numeroId) {
                this.episodiosEnMemoria[i].name = nuevoNombre;
                this.episodiosEnMemoria[i].air_date = nuevaFecha;
                this.episodiosEnMemoria[i].episode = nuevoCodigo;
            }
        }

        // PASO B: Guardar los cambios en el localStorage para que no se borren al recargar la página
        const edicionesLocales = JSON.parse(localStorage.getItem('episodios_editados')) || {};
        
        // Creamos la ficha limpia con los campos tal como los necesita el sistema para acoplarse con la API
        edicionesLocales[numeroId] = {
            name: nuevoNombre,
            air_date: nuevaFecha,
            episode: nuevoCodigo
        };
        
        localStorage.setItem('episodios_editados', JSON.stringify(edicionesLocales));
    }
};