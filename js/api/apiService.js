// js/api/apiService.js

// Esta es nuestra caja de herramientas lógicas para comunicarnos con internet
export const apiService = {

    // HERRAMIENTA 1: Va a la API a buscar los primeros personajes
    obtenerPersonajesDeInternet() {
        
        // 1. Hacemos una petición (fetch) a la dirección web de los personajes
        return fetch('https://rickandmortyapi.com/api/character')
            .then(function(respuestaDelServidor) {
                
                // 2. Revisamos si la página web respondió bien
                if (respuestaDelServidor.ok === false) {
                    alert('Hubo un problema con el servidor al cargar los personajes.');
                    return [];
                }
                
                // 3. Convertimos el texto plano de internet a un objeto de JavaScript
                return respuestaDelServidor.json();
            })
            .then(function(datosConvertidos) {
                
                // 4. Devolvemos solo la lista de personajes que está en el cajón "results"
                return datosConvertidos.results; 
            })
            .catch(function(errorDeConexion) {
                
                // 5. Red de seguridad por si falla el internet
                alert('No se pudo conectar a internet para traer los personajes.');
                return [];
            });
    },

    // HERRAMIENTA 2: Va a la API a buscar los primeros episodios
    obtenerEpisodiosDeInternet() {
        
        // 1. Hacemos una petición (fetch) a la dirección web de los episodios
        return fetch('https://rickandmortyapi.com/api/episode')
            .then(function(respuestaDelServidor) {
                
                // 2. Revisamos si la página web respondió bien
                if (respuestaDelServidor.ok === false) {
                    alert('Hubo un problema con el servidor al cargar los episodios.');
                    return [];
                }
                
                // 3. Convertimos el texto plano de internet a un objeto de JavaScript
                return respuestaDelServidor.json();
            })
            .then(function(datosConvertidos) {
                
                // 4. Devolvemos solo la lista de episodios que está en el cajón "results"
                return datosConvertidos.results; 
            })
            .catch(function(errorDeConexion) {
                
                // 5. Red de seguridad por si falla el internet
                alert('No se pudo conectar a internet para traer los episodios.');
                return [];
            });
    }

};