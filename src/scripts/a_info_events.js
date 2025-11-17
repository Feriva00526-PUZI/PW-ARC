
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

    const titulo_overlay2 = document.getElementById("titulo_overlay2");
    const est1 = document.getElementById("est1");
    const est2 = document.getElementById("est2");
    const est3 = document.getElementById("est3");
    const est4 = document.getElementById("est4");
    const est5 = document.getElementById("est5");
    const overlay3 = document.getElementById("overlay3");
    const overlay4 = document.getElementById("overlay4");
    const overlayEx = document.getElementById("overlayEx");

    est1.addEventListener("click", () => {
        titulo_overlay2.textContent = "Popularidad de los lugares";
        overlay3.innerHTML = `<div class="minicard">Cargando filtro...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles</div>`;
        overlayEx.innerHTML = `
                <select id="filtroLugares">
                    <option value="query1">Mas Populares</option>
                    <option value="query2">Menos Populares</option>
                </select>
        `;

        cargarDatos('query1');
        const filtroLugares = document.getElementById("filtroLugares");
        filtroLugares.addEventListener("change", () => {
            const filtroSelected = filtroLugares.value;
            cargarDatos(tipoQuery(filtroSelected));
        });
    });
    est2.addEventListener("click", () => {
        titulo_overlay2.textContent = "Popularidad de Eventos";
        overlay3.innerHTML = `<div class="minicard">Cargando filtro...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles</div>`;
        overlayEx.innerHTML = `
                <select id="filtroEventos">
                    <option value="query3">Mas Populares</option>
                    <option value="query4">Menos Populares</option>
                </select>
        `;

        cargarDatos('query3');
        const filtroEventos = document.getElementById("filtroEventos");
        filtroEventos.addEventListener("change", () => {
            const filtroSelected = filtroEventos.value;
            cargarDatos(tipoQuery(filtroSelected));
        });
    });
    est3.addEventListener("click", () => {
        titulo_overlay2.textContent = "Informacion de las Asistencias";
    });
    est4.addEventListener("click", () => {
        titulo_overlay2.textContent = "Tamaño de los eventos";
    });
    est5.addEventListener("click", () => {
        titulo_overlay2.textContent = "Informacion de las Organizadoras";
    });
    function tipoQuery(valorFiltro) {
        if (valorFiltro === "query1") {
            return "query1";
        } else if (valorFiltro === "query2") {
            return "query2";
        } else if (valorFiltro === "query3") {
            return "query3";
        } else if (valorFiltro === "query4") {
            return "query4";
        }
    }
    const cargarDatos = (query) => {
        if (!query) return;
        if (query === 'query1' || query === 'query2') {
            overlay3.innerHTML = `<div class="minicard">Cargando lugares...</div>`;
            fetch(`./../../data/logic/infoEventosLogic.php?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data.correcto && data.lugares) {
                        const lugares = data.lugares;
                        overlay3.innerHTML = "";
                        lugares.forEach(lugar => {
                            const card = document.createElement("div");
                            card.innerHTML = `
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
                            overlay3.appendChild(card);
                            const reviewButton = card.querySelector(`#br-${lugar.id_lugar}`);
                            reviewButton.addEventListener('click', function () {
                                sessionStorage.setItem('id_lugar_selected', lugar.id_lugar);
                                sessionStorage.setItem('lugar_objeto', JSON.stringify(lugar));
                                overlay4.innerHTML = `
                                    <div class="maxicard">
                                        <h4 class="maxicard-titulo">${lugar.nombre_lugar}</h4>
                                        <div class="maxicard-imagen">
                                            <img src="${lugar.imagen_url}" alt="Imagen de ${lugar.nombre_lugar}">
                                        </div>
                                        <div class="maxicard-descripcion">
                                            <p>Descripción:</p>
                                            <span>${lugar.descripcion}</span>
                                        </div>
                                        <div class="maxicard-info-grid">
                                            <p class="maxicard-dato">Ciudad: <span>${lugar.ciudad}</span></p>
                                            <p class="maxicard-dato">Zona: <span>${lugar.zona}</span></p>
                                            <p class="maxicard-dato dato-full">Dirección: <span>${lugar.direccion}</span></p>
                                            <p class="maxicard-dato">Asistencias: <span>${lugar.total_asistencias}</span></p>
                                            <p class="maxicard-dato">ID: <span>${lugar.id_lugar}</span></p>
                                        </div>
                                    </div>`;
                            });
                        });
                    } else {
                        overlay3.innerHTML = `<div class="minicard">No se encontraron lugares...</div>`;
                    }
                })
                .catch(error => {
                    overlay3.innerHTML = `<div class="minicard">Error al cargar datos: ${error.message}</div>`;
                });
        } else if (query === 'query3' || query === 'query4') {
            overlay3.innerHTML = `<div class="minicard">Cargando eventos...</div>`;
            fetch(`./../../data/logic/infoEventosLogic.php?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.correcto);
                    console.log(data.lugares);

                    // Usamos 'lugares' porque el PHP lo devuelve así, aunque sean eventos
                    if (data.correcto && data.lugares) {
                        const eventos = data.lugares;
                        overlay3.innerHTML = "";

                        eventos.forEach(evento => {
                            const card = document.createElement("div");
                            card.innerHTML = `
                        <div class="cards">
                            <div class="div-info-card">
                                <h2>${evento.nombre_evento}</h2>
                                <span class="info-card-ciudad">Fecha: ${evento.fecha_evento}</span>
                                <span class="info-card-direccion">Lugar: ${evento.nombre_lugar}</span>
                                <button class="btn-revisar" id="br-${evento.id_evento}">Revisar Evento</button>
                            </div>
                            <div class="div-image-card">
                                <img class="image-card" src="${evento.imagen_url}" alt="Imagen del evento">
                            </div>
                        </div>`;
                            overlay3.appendChild(card);

                            const reviewButton = card.querySelector(`#br-${evento.id_evento}`);
                            reviewButton.addEventListener('click', function () {
                                sessionStorage.setItem('id_evento_selected', evento.id_evento);
                                sessionStorage.setItem('evento_objeto', JSON.stringify(evento));

                                // MAXICARD CORREGIDA
                                overlay4.innerHTML = `
                            <div class="maxicard">
                                <h4 class="maxicard-titulo">${evento.nombre_evento}</h4>
                                <div class="maxicard-imagen">
                                    <img src="${evento.imagen_url}" alt="Imagen de ${evento.nombre_evento}">
                                </div>
                                <div class="maxicard-descripcion">
                                    <p>Descripción:</p>
                                    <span>${evento.descripcion}</span>
                                </div>
                                <div class="maxicard-info-grid">
                                    <p class="maxicard-dato">Lugar: <span>${evento.nombre_lugar}</span></p>
                                    <p class="maxicard-dato">Fecha: <span>${evento.fecha_evento}</span></p> 
                                    <p class="maxicard-dato">Hora: <span>${evento.hora_evento}</span></p> 
                                    <p class="maxicard-dato dato-full">Total Asistencias: <span>${evento.total_asistencias}</span></p>
                                    <p class="maxicard-dato">ID Evento: <span>${evento.id_evento}</span></p>
                                </div>
                            </div>`;
                            });
                        });
                    } else {
                        overlay3.innerHTML = `<div class="minicard">No se encontraron eventos...</div>`;
                    }
                })
                .catch(error => {
                    overlay3.innerHTML = `<div class="minicard">Error al cargar datos: ${error.message}</div>`;
                });
        }
    };
});
