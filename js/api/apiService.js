export const apiService = {

    obtenerPersonajesDeInternet() {
        
        return fetch('https://rickandmortyapi.com/api/character')
            .then(function(respuestaDelServidor) {
                
                if (respuestaDelServidor.ok === false) {
                    alert('Hubo un problema con el servidor al cargar los personajes.');
                    return [];
                }
                
                return respuestaDelServidor.json();
            })
            .then(function(datosConvertidos) {
                
                return datosConvertidos.results; 
            })
            .catch(function(errorDeConexion) {
                
                alert('No se pudo conectar a internet para traer los personajes.');
                return [];
            });
    },

    obtenerEpisodiosDeInternet() {
        
        return fetch('https://rickandmortyapi.com/api/episode')
            .then(function(respuestaDelServidor) {
                
                if (respuestaDelServidor.ok === false) {
                    alert('Hubo un problema con el servidor al cargar los episodios.');
                    return [];
                }
                
                return respuestaDelServidor.json();
            })
            .then(function(datosConvertidos) {
                
                return datosConvertidos.results; 
            })
            .catch(function(errorDeConexion) {
                
                alert('No se pudo conectar a internet para traer los episodios.');
                return [];
            });
    }

};
