export const episodeService = {
    
    episodiosEnMemoria: [],
    columnaOrdenadaActual: '',
    ordenAscendente: true,

    inicializarEpisodios(episodiosApi) {
        const edicionesLocales = JSON.parse(localStorage.getItem('episodios_editados')) || {};
        
        this.episodiosEnMemoria = episodiosApi.map(function(episodio) {
            if (edicionesLocales[episodio.id]) {
                return Object.assign({}, episodio, edicionesLocales[episodio.id]);
            }
            return episodio;
        });
    },

    buscarPorNombre(textoCajaDeBusqueda) {
        const textoLimpio = textoCajaDeBusqueda.toLowerCase().trim();
        
        return this.episodiosEnMemoria.filter(function(episodio) {
            return episodio.name.toLowerCase().includes(textoLimpio);
        });
    },

    ordenarEpisodios(listaAOrganizar, nombreColumna) {
        if (this.columnaOrdenadaActual === nombreColumna) {
            this.ordenAscendente = !this.ordenAscendente;
        } else {
            this.columnaOrdenadaActual = nombreColumna;
            this.ordenAscendente = true;
        }

        const direccionOrden = this.ordenAscendente;

        return listaAOrganizar.sort(function(elementoA, elementoB) {
            let valorA = elementoA[nombreColumna];
            let valorB = elementoB[nombreColumna];

            if (nombreColumna === 'id') {
                if (direccionOrden === true) {
                    return valorA - valorB;
                } else {
                    return valorB - valorA;
                }
            }

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
            return 0;
        });
    },

    guardarEdicion(idRecibido, nuevoNombre, nuevaFecha, nuevoCodigo) {
        const numeroId = Number(idRecibido);
        
        for (let i = 0; i < this.episodiosEnMemoria.length; i++) {
            if (this.episodiosEnMemoria[i].id === numeroId) {
                this.episodiosEnMemoria[i].name = nuevoNombre;
                this.episodiosEnMemoria[i].air_date = nuevaFecha;
                this.episodiosEnMemoria[i].episode = nuevoCodigo;
            }
        }

        const edicionesLocales = JSON.parse(localStorage.getItem('episodios_editados')) || {};
        
        edicionesLocales[numeroId] = {
            name: nuevoNombre,
            air_date: nuevaFecha,
            episode: nuevoCodigo
        };
        
        localStorage.setItem('episodios_editados', JSON.stringify(edicionesLocales));
    }
};
