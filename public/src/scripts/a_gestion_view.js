window.addEventListener("load", function () {
    const administradorSession = sessionStorage.getItem("admin_logeado");
    if (administradorSession == null) {
        window.location.href = "./../../../index.html";
        return;
    }
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
            s_header.style.backgroundImage = "url(./../../media/images/layout/imgLayout20.jpg)";
            s_header.style.backgroundPosition = "50% 50%";

            /*Cambiar el titulo del header */
            document.getElementById("n_h2").innerText = "Gestion de los lugares del sitio";
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

            /*Tercero*/
            const a3 = document.createElement("a");
            a3.id = "a3";
            a3.href = "./a_info_events.html";
            const ai3 = document.createElement("img");
            ai3.src = "./../../media/images/icons/iconAnav3.png";
            ai3.classList.add("icon_nav");
            a3.appendChild(ai3);
            a3.append("Estadisticas");
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
            f_general.style.backgroundImage = "url(./../../media/images/layout/imgLayout15.jpg)";
            /*Cambiar que parte de la imagen se ve, el primer 50 es horizontalmente(no cambiarlo) y el segundo es para la altura que se visualiza */
            f_general.style.backgroundPosition = "50% 80%";
        });

    /* Creaccion dinamica de las cards */

    fetch("./../../data/logic/lugarLogic.php").then(response => response.json()).then(data => {
        if (data.correcto && data.lugares) {
            const lugares = data.lugares;
            const contenedor_lugares = document.getElementById("contenedor_lugares");
            const zonas = {};

            lugares.forEach(lugar => {
                let contenedorZona;

                if (!zonas[lugar.zona]) {
                    const box_zone = document.createElement("div");
                    box_zone.classList.add("box-zone");
                    box_zone.id = `zona-${lugar.zona}`;

                    const div_zona = document.createElement("div");
                    div_zona.classList.add("div-zone");
                    const h2 = document.createElement("h2");
                    h2.innerText = lugar.zona;
                    div_zona.appendChild(h2);

                    const div_card = document.createElement("div");
                    div_card.classList.add("div-card");
                    div_card.id = `cards-${lugar.zona}`;

                    box_zone.appendChild(div_zona);
                    box_zone.appendChild(div_card);
                    contenedor_lugares.appendChild(box_zone);

                    zonas[lugar.zona] = div_card;
                }

                contenedorZona = zonas[lugar.zona];

                // En a_gestion_view.js, dentro del bucle lugares.forEach(lugar => { ... })

                const card_individual = `
    <div class="cards">
        <div class="div-info-card">
            <h2>${lugar.nombre_lugar}</h2>
            <span class="info-card-ciudad">${lugar.ciudad}</span>
            <span class="info-card-direccion">${lugar.direccion}</span>
            <button class="btn-revisar" id="br-${lugar.id_lugar}">Revisar Lugar</button>
        </div>
        <div class="div-image-card">
            <img class="image-card" src="${lugar.imagen_url}" alt="Imagen del lugar">
        </div>
    </div>`;

                contenedorZona.insertAdjacentHTML("beforeend", card_individual);
            });
            document.querySelectorAll('.btn-revisar').forEach(button => {
                button.addEventListener('click', function (e) {

                    const fullId = e.target.id;
                    const id_lugar_selected = fullId.split('-').pop();

                    const lugar_objeto = lugares.find(lugar => lugar.id_lugar == id_lugar_selected);

                    sessionStorage.setItem('id_lugar_selected', id_lugar_selected);
                    sessionStorage.setItem('lugar_objeto', JSON.stringify(lugar_objeto));

                    window.location.href = "./a_gestion_moves.html";
                });
            });
        } else {
            console.log("Hubo error en el if de correcto y lugares en a_gestion_viewJS");
        }
    }).catch(error => {
        alert("Error de conexión al servidor. No se pudieron obtener los lugares.");
    });

    const btn_crear_lugar = document.getElementById("btn_crear_lugar");
    btn_crear_lugar.addEventListener("click", () => {
        window.location.href = "./a_crear_lugar.html";
    });
});
