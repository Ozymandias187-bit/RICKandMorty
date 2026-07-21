export const characterService = {
    
    personajesEnMemoria: [],
    columnaOrdenadaActual: '',
    ordenAscendente: true,

    inicializarPersonajes(personajesApi) {
        const edicionesLocales = JSON.parse(localStorage.getItem('personajes_editados')) || {};
        
        this.personajesEnMemoria = personajesApi.map(function(personaje) {
            if (edicionesLocales[personaje.id]) {
                return Object.assign({}, personaje, edicionesLocales[personaje.id]);
            }
            return personaje;
        });
    },

    buscarPorNombre(textoCajaDeBusqueda) {
        const textoLimpio = textoCajaDeBusqueda.toLowerCase().trim();
        
        return this.personajesEnMemoria.filter(function(personaje) {
            return personaje.name.toLowerCase().includes(textoLimpio);
        });
    },

    ordenarPersonajes(listaAOrganizar, nombreColumna) {
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

    guardarEdicion(idRecibido, nuevoNombre, nuevaEspecie, nuevoGenero, nuevoTipo) {
        const numeroId = Number(idRecibido);
        
        for (let i = 0; i < this.personajesEnMemoria.length; i++) {
            if (this.personajesEnMemoria[i].id === numeroId) {
                this.personajesEnMemoria[i].name = nuevoNombre;
                this.personajesEnMemoria[i].species = nuevaEspecie;
                this.personajesEnMemoria[i].gender = nuevoGenero;
                this.personajesEnMemoria[i].type = nuevoTipo;
            }
        }

        const edicionesLocales = JSON.parse(localStorage.getItem('personajes_editados')) || {};
        
        edicionesLocales[numeroId] = {
            name: nuevoNombre,
            species: nuevaEspecie,
            gender: nuevoGenero,
            type: nuevoTipo
        };
        
        localStorage.setItem('personajes_editados', JSON.stringify(edicionesLocales));
    }
};
