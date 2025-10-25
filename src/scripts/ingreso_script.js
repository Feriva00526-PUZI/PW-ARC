window.addEventListener("load", function () {
    document.querySelector("body").style.backgroundImage = "none";
    const boton_registro = document.getElementById("cambio_registro");
    const boton_login = document.getElementById("cambio_login");
    const container = document.getElementById("contenedor");

    boton_registro.addEventListener("click", function () {
        container.classList.add("panel_derecho_activo");
    });
    boton_login.addEventListener("click", function () {
        container.classList.remove("panel_derecho_activo");
    });
});