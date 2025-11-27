let admins;
let usuarios;
let organizadores;
let agencias;

export function buscarUsuarios(usuario, contra) {
    console.log("Busque en usuarios");
    const credenciales = {
        user: usuario,
        password: contra
    };
    return fetch("../data/logic/usuarioLogic.php", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credenciales) }).then(response => response.json()).then(data => {
        let validacion = false;
        if (data.correcto) {
            console.log("validado");
            return data.usuario;
        }
        return false;

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
            return data.admin;
        }
        return false;

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
    const credenciales = {
        user: usuario,
        password: contra
    };
    return fetch("../data/logic/organizadorLogic.php", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credenciales) }).then(response => response.json()).then(data => {
        let validacion = false;
        if (data.correcto) {
            console.log("validado");
            return data.organizador;
        }
        return false;

    });
}

export function buscarAgencias(usuario, contra) {
    console.log("Busque en agencias");
    const credenciales = {
        user: usuario,
        password: contra
    };
    return fetch("../data/logic/agenciaLogic.php", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credenciales) }).then(response => response.json()).then(data => {
        let validacion = false;
        if (data.correcto) {
            console.log("validado");
            return data.agencia;
        }
        return false;

    });
};
