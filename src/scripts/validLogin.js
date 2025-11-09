let admins;
let usuarios;
let organizadores;
let agencias;

export function buscarUsuarios(usuario, contra) {
    console.log("Busque en usuarios");
    return fetch("./../data/clientes.json").then(response => response.json()).then(data => {
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
    const credenciales = {
        user: usuario,
        password: contra
    };
    return fetch("../data/logic/adminLogic.php", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credenciales) }).then(response => response.json()).then(data => {
        let validacion = false;
        if (data.correcto) {
            console.log("validado")
            validacion = true;
        }
        return validacion;

        /*
        admins = data;
        let validacion = false;
        admins.forEach((admin) => {
            if (admin.user === usuario && admin.password === contra) {
                console.log("validado");
                validacion = true;
            }
        });
        return validacion;
        */
    });
};
export function buscarOrganizadores(usuario, contra) {
    console.log("Busque en organizadores");
    return fetch("./../data/organizers.json").then(response => response.json()).then(data => {
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
        agencias = data;
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
