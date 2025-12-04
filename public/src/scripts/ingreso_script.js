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
        configurarInputsAyuda();
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
                    sessionStorage.setItem("organizador_logeado", JSON.stringify(validacion));
                    window.location.href = "./organizers/organizer.html"
                } else {
                    datos_incorrectos.showModal();
                }
            });
        } else if (tipo_usuario == 4) {
            metodosBusqueda.buscarAgencias(usuario, contra).then(validacion => {
                if (validacion) {
                    sessionStorage.setItem("agencia_logeado", JSON.stringify(validacion));
                    window.location.href = "./agencies/agency.html"
                } else {
                    datos_incorrectos.showModal();
                }
            });
        }

        e.preventDefault();

    });
    const close_datos_incorrectos = document.getElementById("close_datos_incorrectos");
    close_datos_incorrectos.addEventListener("click", function () {
        datos_incorrectos.close();

    });
    const boton_registrarse = document.getElementById("boton_registrarse");
    const tipo_usuario = sessionStorage.getItem("tipo_usuario");
    if (tipo_usuario == 2) {
        boton_registrarse.disabled = true;
    } else {
        boton_registrarse.disabled = false;
    }
    const registro_correcto = document.getElementById("registro_correcto");
    const close_registro_correcto = document.getElementById("close_registro_correcto");
    const registro_duplicado = document.getElementById("registro_duplicado");
    const close_registro_duplicado = document.getElementById("close_registro_duplicado");
    boton_registrarse.addEventListener("click", (e) => {

        e.preventDefault();
        const form_registro = document.getElementById("form_registro");
        const formData = new FormData(form_registro);
        formData.append('tipo_registro', tipo_usuario);
        fetch("./../data/Logic/registroLogic.php", {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la peticion.');
                }
                return response.json();
            })
            .then(data => {
                if (data.correcto === true) {
                    registro_correcto.showModal();
                } else {
                    registro_duplicado.showModal();
                }
            })
            .catch(error => {
                registro_duplicado.showModal();
            });
    });
    close_registro_duplicado.addEventListener("click", () => {
        registro_duplicado.close();
    });
    close_registro_correcto.addEventListener("click", () => {
        registro_correcto.close();
        window.location.href = "./../../index.html";
    });
});

function configurarInputsAyuda() {
    const r_correo = document.getElementById("r_correo");
    const r_telefono = document.getElementById("r_telefono");
    const r_apellido = document.getElementById("r_apellido");
    const r_nombre = document.getElementById("r_nombre");
    const r_usuario = document.getElementById("r_usuario");

    const addTooltipWrapper = (element, text) => {
        if (!element) return;

        if (element.parentElement.classList.contains('tooltip-container')) {
            element.parentElement.setAttribute('data-tooltip', text);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'tooltip-container';
        wrapper.setAttribute('data-tooltip', text);

        element.parentNode.insertBefore(wrapper, element);

        wrapper.appendChild(element);

        element.removeAttribute("title");
        element.style.width = "100%";
    };

    addTooltipWrapper(r_correo, "Debe terminar en @hotmail.com o @gmail.com.");
    addTooltipWrapper(r_telefono, "Debe contener exactamente 10 dígitos.");
    addTooltipWrapper(r_nombre, "Máximo 20 caracteres. Solo letras y espacios.");
    addTooltipWrapper(r_usuario, "Máximo 30 caracteres.");
    addTooltipWrapper(r_apellido, "Máximo 20 caracteres. Solo letras y espacios.");

}