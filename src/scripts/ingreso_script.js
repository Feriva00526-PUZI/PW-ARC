window.addEventListener("load", function () {
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
        e.preventDefault();
        const i_usuario = document.getElementById("i_usuario");
        const i_password = document.getElementById("i_password");

        if (i_usuario.value == "admin" && i_password.value == "admin") {
            sessionStorage.setItem("admin_logeado", i_usuario.value);
            window.location.href = "./admin/a_gestion_view.html";
            //window.location.replace("./admin/a_gestion_view.html");
        } else {
            i_usuario.value = "";
            i_password.value = "";
            datos_incorrectos.showModal();
        }
    });
    const close_datos_incorrectos = document.getElementById("close_datos_incorrectos");
    close_datos_incorrectos.addEventListener("click", function () {
        datos_incorrectos.close();
    });
});