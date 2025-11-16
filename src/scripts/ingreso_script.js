import * as metodosBusqueda from "./validLogin.js";
window.addEventListener("load", function () {
    sessionStorage.removeItem("admin_logeado");
    sessionStorage.removeItem("usuario_logeado");
    sessionStorage.removeItem("agencia_logeado");
    sessionStorage.removeItem("organizador_logeado");
    document.querySelector("body").style.backgroundImage = "none";
    const datos_incorrectos = document.getElementById("datos_incorrectos");
    const boton_registro = document.getElementById("cambio_registro");
    const boton_login = document.getElementById("cambio_login");
    const boton_acceder = document.getElementById("boton_acceder");
    const container = document.getElementById("contenedor");

    boton_registro.addEventListener("click", function () {
        container.classList.add("panel_derecho_activo");
    });
    boton_login.addEventListener("click", function () {
        container.classList.remove("panel_derecho_activo");
    });
    boton_acceder.addEventListener("click", function (e) {
        const tipo_usuario = sessionStorage.getItem("tipo_usuario");
        const i_usuario = document.getElementById("i_usuario");
        const i_password = document.getElementById("i_password");
        const usuario = i_usuario.value;
        const contra = i_password.value;
        if (tipo_usuario == 1) {
            metodosBusqueda.buscarUsuarios(usuario, contra).then(validacion => {
                if (validacion) {
                    sessionStorage.setItem("usuario_logeado", JSON.stringify(validacion));
                    window.location.href = "./user/usuario_principal.html";
                } else {
                    datos_incorrectos.showModal();
                }
            });
        } else if (tipo_usuario == 2) {
            metodosBusqueda.buscarAdmins(usuario, contra).then(validacion => {
                if (validacion) {
                    sessionStorage.setItem("admin_logeado", JSON.stringify(validacion));
                    window.location.href = "./admin/a_gestion_view.html";
                } else {
                    datos_incorrectos.showModal();
                }
            });
        } else if (tipo_usuario == 3) {
            metodosBusqueda.buscarOrganizadores(usuario, contra).then(validacion => {
                if (validacion) {
                    alert("si");
                    sessionStorage.setItem("organizador_logeado", JSON.stringify(validacion));
                } else {
                    datos_incorrectos.showModal();
                }
            });
        } else if (tipo_usuario == 4) {
            metodosBusqueda.buscarAgencias(usuario, contra).then(validacion => {
                if (validacion) {
                    alert("si");
                    sessionStorage.setItem("agencia_logeado", JSON.stringify(validacion));
                } else {
                    datos_incorrectos.showModal();
                }
            });
        }

        e.preventDefault();


        /*
        if (i_usuario.value == "admin" && i_password.value == "admin") {
            sessionStorage.setItem("admin_logeado", i_usuario.value);
            window.location.href = "./admin/a_gestion_view.html";
            //window.location.replace("./admin/a_gestion_view.html");
        } else {
            i_usuario.value = "";
            i_password.value = "";
            datos_incorrectos.showModal();
        }
        */
    });
    const close_datos_incorrectos = document.getElementById("close_datos_incorrectos");
    close_datos_incorrectos.addEventListener("click", function () {
        datos_incorrectos.close();
    });
});