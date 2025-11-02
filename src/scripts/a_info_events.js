
window.addEventListener("load", function () {

    fetch("./../../components/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            const script = document.createElement("script");
            script.src = "./../../scripts/header_script.js";
            document.body.appendChild(script);

            /*HEADER DINAMICO */
            /*Cambio de la imagen del header */
            const s_header = document.getElementById("s_header");
            s_header.style.backgroundImage = "url(./../../media/images/layout/imgLayout13.jpg)";
            s_header.style.backgroundPosition = "50% 50%";

            /*Cambiar el titulo del header */
            document.getElementById("n_h2").innerText = "Estadisticas de los Eventos";
            document.getElementById("s_icon").setAttribute("src", "./../../media/images/icons/icon_arc.png");
            const bnav = document.getElementById("underline_nav");

            /*Agregar los elementos al nav */
            /*Primero*/
            const a1 = document.createElement("a");
            a1.id = "a1";
            a1.href = "./a_gestion_view.html";
            const ai1 = document.createElement("img");
            ai1.src = "./../../media/images/icons/iconAnav1.png";
            ai1.classList.add("icon_nav");
            a1.appendChild(ai1);
            a1.append("Gestion de lugares");
            bnav.appendChild(a1);
            /*Segundo*/
            const a2 = document.createElement("a");
            a2.id = "a2";
            a2.href = "./a_info_agency.html";
            const ai2 = document.createElement("img");
            ai2.src = "./../../media/images/icons/iconAnav2.png";
            ai2.classList.add("icon_nav");
            a2.appendChild(ai2);
            a2.append("Estadisticas de los Viajes");
            bnav.appendChild(a2);
            /*Tercero*/
            const a3 = document.createElement("a");
            a3.id = "a3";
            a3.href = "./a_info_events.html";
            const ai3 = document.createElement("img");
            ai3.src = "./../../media/images/icons/iconAnav3.png";
            ai3.classList.add("icon_nav");
            a3.appendChild(ai3);
            a3.append("Estadisticas de los Eventos");
            bnav.appendChild(a3);
        });

    /*Copiar y pegar eso para añadir el footer en la pagina que sea */
    fetch("./../../components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);

            /*Cambio del icono ARC (Solo para actualizar la ruta relativa) */
            document.getElementById("f_icon").setAttribute("src", "./../../media/images/icons/icon_arc.png");

            /*Cambio link del boton hacia la pagina About Us (Solo para actualizar la ruta relativa) */
            document.querySelector(".f_link").href = "#";

            /*Cambio de la imagen del footer derecho*/
            const f_general = document.getElementById("f_general");
            f_general.style.backgroundImage = "url(./../../media/images/layout/imgLayout14.jpg)";
            /*Cambiar que parte de la imagen se ve, el primer 50 es horizontalmente(no cambiarlo) y el segundo es para la altura que se visualiza */
            f_general.style.backgroundPosition = "50% 80%";
        });
});
