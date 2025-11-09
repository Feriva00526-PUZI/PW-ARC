import { crearCarrusel } from "./carousel.js";
import { crearHeader } from "./header.js";
import { crearFooter } from "./footer.js";

window.addEventListener("load", function () {

    crearHeader({
        titulo: "PÁGINA PRINCIPAL",
        icono: "./src/media/images/icons/icon_arc.png",
        background: "./src/media/images/layout/img_background_header.jpg",
        navItems: [
            { id: "a1", href: "#", icon: "./src/media/images/icons/icon_home.png", texto: "Inicio" },
            { id: "a2", href: "#", icon: "./src/media/images/icons/icon_travel.png", texto: "Destinos" },
            { id: "a3", href: "#", icon: "./src/media/images/icons/icon_event.png", texto: "Eventos" }
        ],
        btnLogin: true
    });

    crearFooter({
        icono: "./src/media/images/icons/icon_arc.png",
        background: "./src/media/images/layout/imgLayout20.jpg",
        linkAbout: "#",
        posicionFondo: "50% 80%"
    });

    // --- Lógica para login y botones ---
    const select_login = document.getElementById("select_login");
    const close_select_login = document.getElementById("close_select_login");
    if (select_login && close_select_login) {
        close_select_login.addEventListener("click", () => select_login.close());
    }

    const tiposUsuarios = [
        { id: "btn_usuario", tipo: "1" },
        { id: "btn_admin", tipo: "2" },
        { id: "btn_organizador", tipo: "3" },
        { id: "btn_agencia", tipo: "4" }
    ];

    tiposUsuarios.forEach(({ id, tipo }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                sessionStorage.setItem("tipo_usuario", tipo);
                window.location.href = "./src/html/ingreso.html";
            });
        }
    });

    crearCarrusel({
        containerSelector: "#carrusel-paquetes",
        dataFile: "paquetes.json",
        type: "paquete",
        title: "Paquetes destacados"
    });
});
