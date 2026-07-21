export const authService = {

    obtenerUsuariosDesdeElNavegador() {
        const datosCargados = localStorage.getItem('usuarios_sistema');
        if (datosCargados === null) {
            return [];
        }
        return JSON.parse(datosCargados);
    },

    register(nombreUsuario, correo, clave, preguntaSeguridad, respuestaSeguridad) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            if (listaUsuarios[i].username === nombreUsuario || listaUsuarios[i].email === correo) {
                throw new Error('El nombre de usuario o el correo electrónico ya están registrados.');
            }
        }

        const nuevoUsuario = {
            username: nombreUsuario, 
            email: correo,           
            password: clave,         
            question: preguntaSeguridad, 
            answer: respuestaSeguridad.toLowerCase().trim() 
        };

        listaUsuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios_sistema', JSON.stringify(listaUsuarios));
        return true;
    },

    login(usuarioOCorreo, clave) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            const cuentaActual = listaUsuarios[i];
            
            if ((cuentaActual.username === usuarioOCorreo || cuentaActual.email === usuarioOCorreo) && cuentaActual.password === clave) {
                localStorage.setItem('sesion_activa', 'si');
                localStorage.setItem('usuario_actual', cuentaActual.username);
                return cuentaActual;
            }
        }

        throw new Error('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.');
    },

    findUserForRecovery(usuarioOCorreo) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            const cuentaActual = listaUsuarios[i];
            if (cuentaActual.username === usuarioOCorreo || cuentaActual.email === usuarioOCorreo) {
                return cuentaActual; 
            }
        }

        throw new Error('No pudimos encontrar ninguna cuenta con ese usuario o correo.');
    },

    resetPassword(nombreUsuario, respuestaEscrita, nuevaClave) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            if (listaUsuarios[i].username === nombreUsuario) {
                
                if (listaUsuarios[i].answer === respuestaEscrita.toLowerCase().trim()) {
                    listaUsuarios[i].password = nuevaClave;
                    
                    localStorage.setItem('usuarios_sistema', JSON.stringify(listaUsuarios));
                    return true;
                } else {
                    throw new Error('La respuesta de seguridad es incorrecta.');
                }
            }
        }
        
        throw new Error('Ocurrió un error inesperado al procesar tu solicitud.');
    }
};
