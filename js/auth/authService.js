// js/auth/authService.js

export const authService = {

    // HERRAMIENTA AUXILIAR: Busca usuarios en el localStorage
    obtenerUsuariosDesdeElNavegador() {
        const datosCargados = localStorage.getItem('usuarios_sistema');
        if (datosCargados === null) {
            return [];
        }
        return JSON.parse(datosCargados);
    },

    // 1. REGISTRO (Corregido para guardar propiedades en inglés)
    register(nombreUsuario, correo, clave, preguntaSeguridad, respuestaSeguridad) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            // Cambiado a .username y .email para consistencia
            if (listaUsuarios[i].username === nombreUsuario || listaUsuarios[i].email === correo) {
                throw new Error('El nombre de usuario o el correo electrónico ya están registrados.');
            }
        }

        const nuevoUsuario = {
            username: nombreUsuario, // <--- Propiedad en inglés
            email: correo,           // <--- Propiedad en inglés
            password: clave,         // <--- Propiedad en inglés
            question: preguntaSeguridad, // <--- Propiedad en inglés (así app.js la encuentra)
            answer: respuestaSeguridad.toLowerCase().trim() // <--- Propiedad en inglés
        };

        listaUsuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios_sistema', JSON.stringify(listaUsuarios));
        return true;
    },

    // 2. INICIO DE SESIÓN (Corregido para buscar en inglés)
    login(usuarioOCorreo, clave) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            const cuentaActual = listaUsuarios[i];
            
            // Evaluamos usando las propiedades en inglés
            if ((cuentaActual.username === usuarioOCorreo || cuentaActual.email === usuarioOCorreo) && cuentaActual.password === clave) {
                localStorage.setItem('sesion_activa', 'si');
                localStorage.setItem('usuario_actual', cuentaActual.username);
                return cuentaActual;
            }
        }

        throw new Error('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.');
    },

    // 3. RECUPERACIÓN PASO A (Corregido)
    findUserForRecovery(usuarioOCorreo) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            const cuentaActual = listaUsuarios[i];
            if (cuentaActual.username === usuarioOCorreo || cuentaActual.email === usuarioOCorreo) {
                return cuentaActual; // Ahora el objeto devuelto tiene la propiedad .question
            }
        }

        throw new Error('No pudimos encontrar ninguna cuenta con ese usuario o correo.');
    },

    // 4. RECUPERACIÓN PASO B (Corregido)
    resetPassword(nombreUsuario, respuestaEscrita, nuevaClave) {
        const listaUsuarios = this.obtenerUsuariosDesdeElNavegador();
        
        for (let i = 0; i < listaUsuarios.length; i++) {
            if (listaUsuarios[i].username === nombreUsuario) {
                
                if (listaUsuarios[i].answer === respuestaEscrita.toLowerCase().trim()) {
                    listaUsuarios[i].password = nuevaClave; // Actualizamos la contraseña en inglés
                    
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