

export function crearHeader({
    titulo = "PAGINA PRINCIPAL",
    icono = "/src/media/images/icons/icon_arc.png",
    background = "/src/media/images/layout/img_background_header.jpg",
    navItems = [
        { id: "a1", href: "#", icon: "/src/media/images/icons/icon_home.png", texto: "Pagina Principal" },
        { id: "a2", href: "#", icon: "/src/media/images/icons/icon_travel.png", texto: "Lugares Populares" },
        { id: "a3", href: "#", icon: "/src/media/images/icons/icon_event.png", texto: "Eventos Recientes" }
    ],
    btnLogin = true
} = {}) {

    fetch("/src/components/header.html")
        .then(response => response.text())
        .then(data => {
            // Insertar header en el DOM
            document.body.insertAdjacentHTML("afterbegin", data);

            // Agregar script del header
            const script = document.createElement("script");
            script.src = "/src/scripts/header_script.js";
            document.body.appendChild(script);

            // Configuración del header
            const s_header = document.getElementById("s_header");
            const n_h2 = document.getElementById("n_h2");
            const s_icon = document.getElementById("s_icon");
            const bnav = document.getElementById("underline_nav");

            if (s_header) s_header.style.backgroundImage = `url(${background})`;
            if (n_h2) n_h2.innerText = titulo;
            if (s_icon) s_icon.setAttribute("src", icono);

            // Reiniciar el contenido del nav
            if (bnav) {
                bnav.innerHTML = `<h2 id="n_h2" class="n_h2">${titulo}</h2>`;

                // Agregar enlaces personalizados
                navItems.forEach(item => {
                    const a = document.createElement("a");
                    a.id = item.id;
                    a.href = item.href;

                    const iconImg = document.createElement("img");
                    iconImg.src = item.icon;
                    iconImg.classList.add("icon_nav");

                    a.appendChild(iconImg);
                    a.append(item.texto);
                    bnav.appendChild(a);
                });

                // Botón de inicio de sesión
                if (btnLogin) {
                    const btn_is_r = document.createElement("button");
                    btn_is_r.id = "btn_is_r";
                    const btn_a = document.createElement("a");
                    const icon_user = document.createElement("img");
                    icon_user.src = "/src/media/images/icons/icon_user.png";
                    icon_user.classList.add("icon_user");
                    btn_a.appendChild(icon_user);
                    btn_is_r.appendChild(btn_a);
                    bnav.appendChild(btn_is_r);

                    const select_login = document.getElementById("select_login");
                    if (select_login) {
                        btn_is_r.addEventListener("click", () => select_login.showModal());
                    }
                }
            }
        })
        .catch(err => console.error("Error cargando header:", err));
}
