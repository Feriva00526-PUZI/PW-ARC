
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
    const cards5a9 = [
        { title: "Total de Asistencias Completadas", query: "query5" },
        { title: "Total de Reservaciones Pendientes", query: "query6" },
        { title: "Total de Reservaciones Canceladas", query: "query7" },
        { title: "Total General de Reservaciones", query: "query8" }
    ];
    est3.addEventListener("click", () => {
        titulo_overlay2.textContent = "Informacion de las Asistencias";
        overlay4.innerHTML = `<div class="minicard">Detalles de la estadística</div>`;
        overlayEx.innerHTML = ``;
        overlay3.innerHTML = "";
        cards5a9.forEach(ct => {
            const card = document.createElement("div");
            card.classList.add("statistic-container");
            card.innerHTML = `
                <div class="minicard">
                    <h4 class="card-title">${ct.title}</h4>
                    <button class="btn-detalle" data-query="${ct.query}">Detalle</button>
                </div>
            `;
            overlay3.appendChild(card);
        });
        document.querySelectorAll(".btn-detalle").forEach(button => {
            button.addEventListener("click", (event) => {
                const query = event.target.getAttribute("data-query");
                cargarDatos(query);
            });
        });
    });
    est4.addEventListener("click", () => {
        titulo_overlay2.textContent = "Popularidad de Viajes";
        overlay3.innerHTML = `<div class="minicard">Cargando viajes...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles</div>`;
        overlayEx.innerHTML = `
        <select id="filtroViajes">
            <option value="query9">Más Populares</option>
            <option value="query10">Menos Populares</option>
        </select>
    `;

        cargarDatos('query9');
        const filtroViajes = document.getElementById("filtroViajes");
        filtroViajes.addEventListener("change", () => {
            const filtroSelected = filtroViajes.value;
            cargarDatos(filtroSelected);
        });
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
        } else if (valorFiltro === "query9") {
            return "query9";
        } else if (valorFiltro === "query10") {
            return "query10";
        }
    }
    const cargarDatos = (query) => {
        if (!query) return;
        /* Manejo de errores */
        const handleResponse = (response) => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error HTTP ${response.status}. El servidor respondió con: ${text.substring(0, 100)}...`);
                });
            }
            return response.text();
        };

        const parseJSON = (text) => {
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error("Fallo al parsear JSON:", e, "Respuesta RAW:", text);
                throw new Error("Respuesta no es JSON válida. Contenido raw: " + text.substring(0, 50) + "...");
            }
        };
        /*fin del manejo de errores */
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
                    }
                    else {
                        overlay3.innerHTML = `<div class="minicard">No se encontraron eventos...</div>`;
                    }
                })
                .catch(error => {
                    overlay3.innerHTML = `<div class="minicard">Error al cargar datos: ${error.message}</div>`;
                });
        } else if (query === 'query9' || query === 'query10') {
            overlay3.innerHTML = `<div class="minicard">Cargando viajes...</div>`;
            fetch(`./../../data/logic/infoEventosLogic.php?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data.correcto && data.viajes) {
                        const viajes = data.viajes;
                        overlay3.innerHTML = "";

                        viajes.forEach(viaje => {
                            const card = document.createElement("div");
                            card.innerHTML = `
                            <div class="cards">
                                <div class="div-info-card">
                                    <h2>${viaje.nombre_paquete}</h2>
                                    <span class="info-card-ciudad">Lugar: ${viaje.nombre_lugar}</span>
                                    <span class="info-card-direccion">Total Viajes: ${viaje.total_viajes}</span>
                                    <button class="btn-revisar" id="br-${viaje.id_paquete}">Revisar Paquete</button>
                                </div>
                                <div class="div-image-card">
                                    <img class="image-card" src="${viaje.imagen_url}" alt="Imagen del paquete de viaje">
                                </div>
                            </div>`;
                            overlay3.appendChild(card);

                            const reviewButton = card.querySelector(`#br-${viaje.id_paquete}`);
                            reviewButton.addEventListener('click', function () {
                                overlay4.innerHTML = `
                                <div class="maxicard">
                                    <h4 class="maxicard-titulo">${viaje.nombre_paquete}</h4>
                                    <div class="maxicard-imagen">
                                        <img src="${viaje.imagen_url}" alt="Imagen de ${viaje.nombre_paquete}">
                                    </div>
                                    <div class="maxicard-descripcion">
                                        <p>Descripción:</p>
                                        <span>${viaje.descripcion_paquete}</span>
                                    </div>
                                    <div class="maxicard-info-grid">
                                        <p class="maxicard-dato">Lugar: <span>${viaje.nombre_lugar}</span></p>
                                        <p class="maxicard-dato">Costo: <span>$${viaje.precio}</span></p> 
                                        <p class="maxicard-dato">Agencia: <span>${viaje.nombre_agencia}</span></p> 
                                        <p class="maxicard-dato dato-full">Total Viajes Completados: <span>${viaje.total_viajes}</span></p>
                                        <p class="maxicard-dato">ID Paquete: <span>${viaje.id_paquete}</span></p>
                                    </div>
                                </div>`;
                            });
                        });
                    } else {
                        overlay3.innerHTML = `<div class="minicard">No se encontraron viajes...</div>`;
                    }
                })
                .catch(error => {
                    overlay3.innerHTML = `<div class="minicard">Error al cargar datos: ${error.message}</div>`;
                });
        } else if (query === 'query5' || query === 'query6' || query === 'query7' || query === 'query8') {
            overlay4.innerHTML = `<div class="maxicard">Cargando detalle de asistencia...</div>`;
            fetch(`./../../data/logic/infoEventosLogic.php?query=${query}`)
                .then(handleResponse)
                .then(parseJSON)
                .then(data => {
                    if (data.correcto && data.lugares) {
                        const result = data.lugares;
                        overlay4.innerHTML = `
                            <div class="maxicard">
                                <h4 class="maxicard-titulo">Resultado de la Consulta</h4>
                                <div class="maxicard-info-grid">
                                    <p class="maxicard-dato">Total Cantidad: <span>${result.count}</span></p>
                                    <p class="maxicard-dato">Porcentaje Total: <span>${result.percentage.toFixed(2)}%</span></p>
                                </div>
                            </div>`;
                    } else {
                        overlay4.innerHTML = `<div class="maxicard">No se pudo obtener el detalle. Mensaje: ${data.mensaje || 'N/A'}</div>`;
                    }
                })
                .catch(error => {
                    overlay4.innerHTML = `<div class="maxicard">Error al cargar el detalle: ${error.message}</div>`;
                });
        }
    };
});