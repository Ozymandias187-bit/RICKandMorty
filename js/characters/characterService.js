// js/characters/characterService.js

// Esta es nuestra caja de herramientas lógicas para organizar y editar los personajes
export const characterService = {
    
    // VARIABLES DE MEMORIA (Guardan el estado de la aplicación mientras está abierta)
    personajesEnMemoria: [],
    columnaOrdenadaActual: '',
    ordenAscendente: true,

    // 1. CONFIGURACIÓN INICIAL: Junta los personajes de internet con los que hayas editado antes
    inicializarPersonajes(personajesApi) {
        // Vamos a la gaveta del navegador (localStorage) a buscar si editamos personajes en el pasado
        const edicionesLocales = JSON.parse(localStorage.getItem('personajes_editados')) || {};
        
        // Recorremos la lista que llegó de internet uno por uno
        this.personajesEnMemoria = personajesApi.map(function(personaje) {
            // Si el ID de este personaje tiene una edición guardada en la gaveta...
            if (edicionesLocales[personaje.id]) {
                // Combinamos los datos originales de internet con los cambios editados localmente
                return Object.assign({}, personaje, edicionesLocales[personaje.id]);
            }
            // Si no ha sido editado, lo dejamos tal cual como llegó de internet
            return personaje;
        });
    },

    // 2. BUSCADOR EN TIEMPO REAL: Filtra los personajes según el nombre que escribas
    buscarPorNombre(textoCajaDeBusqueda) {
        const textoLimpio = textoCajaDeBusqueda.toLowerCase().trim();
        
        // Filtramos la lista en memoria dejando pasar solo los que incluyan el texto escrito
        return this.personajesEnMemoria.filter(function(personaje) {
            return personaje.name.toLowerCase().includes(textoLimpio);
        });
    },

    // 3. ORDENAMIENTO DE COLUMNAS: Ordena la tabla (A-Z o Z-A) al hacer clic en los títulos
    ordenarPersonajes(listaAOrganizar, nombreColumna) {
        // Si haces clic en la misma columna de antes, invertimos el orden. Si es nueva, va de menor a mayor.
        if (this.columnaOrdenadaActual === nombreColumna) {
            this.ordenAscendente = !this.ordenAscendente;
        } else {
            this.columnaOrdenadaActual = nombreColumna;
            this.ordenAscendente = true;
        }

        // Guardamos el estado del orden en variables cortas para usar dentro de la función de abajo
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

            // Si son columnas de texto (Nombre, Especie, Género), las pasamos a minúsculas para comparar bien
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

    // 4. GUARDAR EDICIÓN: Modifica los datos del personaje en la memoria y en la gaveta del navegador
    guardarEdicion(idRecibido, nuevoNombre, nuevaEspecie, nuevoGenero, nuevoTipo) {
        const numeroId = Number(idRecibido);
        
        // PASO A: Buscar al personaje en la memoria de la aplicación y actualizar sus datos
        for (let i = 0; i < this.personajesEnMemoria.length; i++) {
            if (this.personajesEnMemoria[i].id === numeroId) {
                this.personajesEnMemoria[i].name = nuevoNombre;
                this.personajesEnMemoria[i].species = nuevaEspecie;
                this.personajesEnMemoria[i].gender = nuevoGenero;
                this.personajesEnMemoria[i].type = nuevoTipo;
            }
        }

        // PASO B: Guardar los cambios en el localStorage para que no se borren al recargar la página
        const edicionesLocales = JSON.parse(localStorage.getItem('personajes_editados')) || {};
        
        // Creamos la ficha limpia con los campos en inglés tal como los necesita el sistema original
        edicionesLocales[numeroId] = {
            name: nuevoNombre,
            species: nuevaEspecie,
            gender: nuevoGenero,
            type: nuevoTipo
        };
        
        localStorage.setItem('personajes_editados', JSON.stringify(edicionesLocales));
    }
};