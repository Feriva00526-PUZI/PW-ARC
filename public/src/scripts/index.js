import { crearCarrusel } from "./carousel.js";
window.addEventListener("load", function () {

    fetch("./src/components/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            const script = document.createElement("script");
            script.src = "./src/scripts/header_script.js";
            document.body.appendChild(script);

            /*HEADER DINAMICO */
            /*Cambio de la imagen del header */
            const s_header = document.getElementById("s_header");
            s_header.style.backgroundImage = "url(./src/media/images/layout/img_background_header.jpg)";

            /*Cambiar el titulo del header */
            document.getElementById("n_h2").innerText = "PAGINA PRINCIPAL";
            document.getElementById("s_icon").setAttribute("src", "./src/media/images/icons/icon_arc.png");
            const bnav = document.getElementById("underline_nav");

            /*Agregar los elementos al nav */
            /*Primero*/
            const a1 = document.createElement("a");
            a1.id = "a1";
            a1.href = "#";
            const ai1 = document.createElement("img");
            ai1.src = "./src/media/images/icons/icon_home.png";
            ai1.classList.add("icon_nav");
            a1.appendChild(ai1);
            a1.append("Pagina Principal");
            bnav.appendChild(a1);
            /*Segundo*/
            const a2 = document.createElement("a");
            a2.id = "a2";
            a2.href = "#";
            const ai2 = document.createElement("img");
            ai2.src = "./src/media/images/icons/icon_travel.png";
            ai2.classList.add("icon_nav");
            a2.appendChild(ai2);
            a2.append("Lugares Populares");
            bnav.appendChild(a2);
            /*Tercero*/
            const a3 = document.createElement("a");
            a3.id = "a3";
            a3.href = "#";
            const ai3 = document.createElement("img");
            ai3.src = "./src/media/images/icons/icon_event.png";
            ai3.classList.add("icon_nav");
            a3.appendChild(ai3);
            a3.append("Eventos Recientes");
            bnav.appendChild(a3);
            /*Boton de registro o iniciar sesion*/
            const btn_is_r = document.createElement("button");
            btn_is_r.id = "btn_is_r";
            const btn_a = document.createElement("a");
            const icon_user = document.createElement("img");
            icon_user.src = "./src/media/images/icons/icon_user.png";
            icon_user.classList.add("icon_user");
            btn_a.appendChild(icon_user);
            btn_is_r.appendChild(btn_a);
            bnav.appendChild(btn_is_r);

            const select_login = document.getElementById("select_login");
            btn_is_r.addEventListener("click", function () {
                select_login.showModal();
            });
        });

    /*Copiar y pegar eso para añadir el footer en la pagina que sea */
    fetch("./src/components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);

            /*Cambio del icono ARC (Solo para actualizar la ruta relativa) */
            document.getElementById("f_icon").setAttribute("src", "./src/media/images/icons/icon_arc.png");

            /*Cambio link del boton hacia la pagina About Us (Solo para actualizar la ruta relativa) */
            document.querySelector(".f_link").href = "#";

            /*Cambio de la imagen del footer derecho*/
            const f_general = document.getElementById("f_general");
            f_general.style.backgroundImage = "url(./src/media/images/layout/img_background_footer.jpeg)";
            f_general.style.backgroundImage = "url(./src/media/images/layout/imgLayout20.jpg)";
            /*Cambiar que parte de la imagen se ve, el primer 50 es horizontalmente(no cambiarlo) y el segundo es para la altura que se visualiza */
            f_general.style.backgroundPosition = "50% 80%";
        });

    const select_login = document.getElementById("select_login");
    const close_select_login = document.getElementById("close_select_login");
    close_select_login.addEventListener("click", function () {
        select_login.close();
    });

    const btnUsuario = document.getElementById("btn_usuario");
    const btnAdmin = document.getElementById("btn_admin");
    const btnOrganizador = document.getElementById("btn_organizador");
    const btnAgencia = document.getElementById("btn_agencia");

    btnUsuario.addEventListener("click", function () {
        sessionStorage.setItem("tipo_usuario", "1");
        window.location.href = "./src/html/ingreso.html";
    });

    btnAdmin.addEventListener("click", function () {
        sessionStorage.setItem("tipo_usuario", "2");
        window.location.href = "./src/html/ingreso.html";
    });

    btnOrganizador.addEventListener("click", function () {
        sessionStorage.setItem("tipo_usuario", "3");
        window.location.href = "./src/html/ingreso.html";
    });

    btnAgencia.addEventListener("click", function () {
        sessionStorage.setItem("tipo_usuario", "4");
        window.location.href = "./src/html/ingreso.html";
    });

    crearCarrusel({
        containerSelector: "#carrusel-paquetes",
        dataFile: "paquetes.json",
        type: "paquete",
        title: "Paquetes destacados"
    });

});
