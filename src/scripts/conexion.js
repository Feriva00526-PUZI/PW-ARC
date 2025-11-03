let admins;
let usuarios;
let organizadores;
let agencias;

export function buscarUsuarios(usuario, contra) {
    console.log("Busque en usuarios");
    return fetch("./../data/usuarios.json").then(response => response.json()).then(data => {
        usuarios = data;
        let validacion = false;
        usuarios.forEach((usuarioEle) => {
            if (usuarioEle.user === usuario && usuarioEle.password === contra) {
                console.log("validado");
                validacion = true;
            }
        });
        return validacion;
    });
}

export function buscarAdmins(usuario, contra) {
    console.log("Busque en administradores");
    return fetch("./../data/admins.json").then(response => response.json()).then(data => {
        admins = data;
        let validacion = false;
        admins.forEach((admin) => {
            if (admin.user === usuario && admin.password === contra) {
                console.log("validado");
                validacion = true;
            }
        });
        return validacion;
    });
};
export function buscarOrganizadores(usuario, contra) {
    console.log("Busque en organizadores");
    return fetch("./../data/organziadores.json").then(response => response.json()).then(data => {
        organizadores = data;
        let validacion = false;
        organizadores.forEach((agencia) => {
            if (agencia.user === usuario && agencia.password === contra) {
                console.log("validado");
                validacion = true;
            }
        });
        return validacion;
    });
}

export function buscarAgencias(usuario, contra) {
    console.log("Busque en agencias");
    return fetch("./../data/agencias.json").then(response => response.json()).then(data => {
        agecnias = data;
        let validacion = false;
        agencias.forEach((agencia) => {
            if (agencia.user === usuario && agencia.password === contra) {
                console.log("validado");
                validacion = true;
            }
        });
        return validacion;
    });
};
