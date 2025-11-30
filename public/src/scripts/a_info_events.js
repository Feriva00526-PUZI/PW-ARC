
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
    const est6 = document.getElementById("est6");
    const est7 = document.getElementById("est7");
    const est8 = document.getElementById("est8");
    const est9 = document.getElementById("est9");
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

    est7.addEventListener("click", () => {
        titulo_overlay2.textContent = "Remunerabilidad de Organizadoras";
        overlay3.innerHTML = `<div class="minicard">Cargando organizadoras...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles</div>`;
        overlayEx.innerHTML = `
        <select id="filtroOrganizadoras">
            <option value="query15">Más Remunerables</option>
            <option value="query16">Menos Remunerables</option>
        </select>
    `;

        cargarDatos('query15');
        const filtroOrganizadoras = document.getElementById("filtroOrganizadoras");
        filtroOrganizadoras.addEventListener("change", () => {
            const filtroSelected = filtroOrganizadoras.value;
            cargarDatos(filtroSelected);
        });
    });
    est8.addEventListener("click", () => {
        titulo_overlay2.textContent = "Eventos por su Remuneración";
        overlay3.innerHTML = `<div class="minicard">Cargando eventos...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles</div>`;
        overlayEx.innerHTML = `
        <select id="filtroRemuneracionEventos">
            <option value="query17">Más Remunerables</option>
            <option value="query18">Menos Remunerables</option>
        </select>
    `;

        cargarDatos('query17');
        const filtroRemuneracionEventos = document.getElementById("filtroRemuneracionEventos");
        filtroRemuneracionEventos.addEventListener("change", () => {
            const filtroSelected = filtroRemuneracionEventos.value;
            cargarDatos(filtroSelected);
        });
    });

    /*NUEVO NUEVO NUEVO */
    est5.addEventListener("click", () => {
        titulo_overlay2.textContent = "Remunerabilidad de Viajes";
        overlay3.innerHTML = `<div class="minicard">Cargando viajes...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles</div>`;
        overlayEx.innerHTML = `
        <select id="filtroViajes">
            <option value="query11">Más Remunerables</option>
            <option value="query12">Menos Remunerables</option>
        </select>
    `;

        cargarDatos('query11');
        const filtroViajes = document.getElementById("filtroViajes");
        filtroViajes.addEventListener("change", () => {
            const filtroSelected = filtroViajes.value;
            cargarDatos(filtroSelected);
        });
    });

    est6.addEventListener("click", () => {
        titulo_overlay2.textContent = "Remunerabilidad de Agencias";
        overlay3.innerHTML = `<div class="minicard">Cargando agencias...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles</div>`;
        overlayEx.innerHTML = `
        <select id="filtroAgencias">
            <option value="query13">Más Remunerables</option>
            <option value="query14">Menos Remunerables</option>
        </select>
    `;

        cargarDatos('query13');
        const filtroAgencias = document.getElementById("filtroAgencias");
        filtroAgencias.addEventListener("change", () => {
            const filtroSelected = filtroAgencias.value;
            cargarDatos(filtroSelected);
        });
    });

    est9.addEventListener("click", () => {
        titulo_overlay2.textContent = "Búsqueda de Organizadoras";
        overlay3.innerHTML = `<div class="minicard">Cargando organizadoras...</div>`;
        overlay4.innerHTML = `<div class="minicard">Detalles de Organizadora</div>`;

        overlayEx.innerHTML = `
        <div class="query9-filters">
            <select id="select-lugar" class="filter-select small-select">
                <option value="">Lugar</option>
            </select>
            <select id="select-evento" class="filter-select small-select" disabled>
                <option value="">Evento</option>
            </select>
            <select id="select-organizadora" class="filter-select small-select" disabled>
                <option value="">Organizadora</option>
            </select>
        </div>
    `;

        inicializarFiltrosQuery9();
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
        } else if (valorFiltro === "query11") {
            return "query11";
        } else if (valorFiltro === "query12") {
            return "query12";
        } else if (valorFiltro === "query13") {
            return "query13";
        } else if (valorFiltro === "query14") {
            return "query14";
        } else if (valorFiltro === "query15") {
            return "query15";
        } else if (valorFiltro === "query16") {
            return "query16";
        }
    }
    const cargarDatos = (query) => {
        if (!query) return;
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
        } else if (query === 'query9' || query === 'query10' || query === 'query11' || query === 'query12') {
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
        } else if (query === 'query17' || query === 'query18') {

            fetch(`./../../data/logic/infoEventosLogic.php?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data.correcto && data.lugares) {
                        const eventos = data.lugares;
                        const promedioGeneral = data.promedio_general_boleto;
                        overlay3.innerHTML = "";

                        if (promedioGeneral) {
                            overlay3.insertAdjacentHTML('afterbegin', `
                        <div class="minicard promedio-info">
                            Promedio general de boletos: <strong>$${parseFloat(promedioGeneral).toFixed(2)}</strong>
                        </div>
                    `);
                        }

                        eventos.forEach(evento => {
                            const card = document.createElement("div");
                            card.innerHTML = `
                    <div class="cards">
                        <div class="div-info-card">
                            <h2>${evento.nombre_evento}</h2>
                            <span class="info-card-fecha">Fecha: ${evento.fecha_evento}</span>
                            <span class="info-card-lugar">Lugar: ${evento.nombre_lugar}</span>
                            <span class="info-card-recaudacion">Recaudación Total: <strong>$${parseFloat(evento.recaudacion_total || 0).toFixed(2)}</strong></span>
                            <button class="btn-revisar" data-evento-id="${evento.id_evento}">Revisar Evento</button>
                        </div>
                        <div class="div-image-card">
                            <img class="image-card" src="${evento.imagen_url}" alt="Imagen del evento">
                        </div>
                    </div>`;
                            overlay3.appendChild(card);
                        });

                        document.querySelectorAll(".btn-revisar").forEach(button => {
                            button.addEventListener("click", (event) => {
                                const id = event.target.getAttribute("data-evento-id");
                                const eventoSeleccionado = eventos.find(e => String(e.id_evento) === id);

                                if (!eventoSeleccionado) {
                                    overlay4.innerHTML = `<div class="maxicard">Error: No se encontró la información del evento.</div>`;
                                    return;
                                }
                                const recaudacion = parseFloat(eventoSeleccionado.recaudacion_total || 0).toFixed(2);
                                const precioBoleto = parseFloat(eventoSeleccionado.precio_boleto || 0).toFixed(2);

                                overlay4.innerHTML = `
                            <div class="maxicard">
                                <h4 class="maxicard-titulo">${eventoSeleccionado.nombre_evento}</h4>
                                <div class="maxicard-imagen">
                                    <img src="${eventoSeleccionado.imagen_url}" alt="Imagen de ${eventoSeleccionado.nombre_evento}">
                                </div>
                                <div class="maxicard-descripcion">
                                    <p>Descripción:</p>
                                    <span>${eventoSeleccionado.descripcion || 'Sin descripción disponible.'}</span>
                                </div>
                                <div class="maxicard-info-grid">
                                    <p class="maxicard-dato">Lugar: <span>${eventoSeleccionado.nombre_lugar}</span></p>
                                    <p class="maxicard-dato">Fecha: <span>${eventoSeleccionado.fecha_evento}</span></p>
                                    <p class="maxicard-dato">Hora: <span>${eventoSeleccionado.hora_evento}</span></p>
                                    <p class="maxicard-dato">Precio Boleto: <span>$${precioBoleto}</span></p>
                                    
                                    <p class="maxicard-dato dato-full">Recaudación Total: <strong>$${recaudacion}</strong></p>
                                    <p class="maxicard-dato">ID Evento: <span>${eventoSeleccionado.id_evento}</span></p>
                                </div>
                            </div>
                        `;
                            });
                        });

                    } else {
                        overlay3.innerHTML = `<div class="minicard">No se encontraron eventos. Mensaje: ${data.mensaje || 'N/A'}</div>`;
                    }
                })
                .catch(error => {
                    overlay3.innerHTML = `<div class="minicard">Error al cargar datos de Remuneración: ${error.message}</div>`;
                });

        } else if (query === 'query13' || query === 'query14') {
            overlay3.innerHTML = `<div class="minicard">Cargando agencias...</div>`;
            fetch(`./../../data/logic/infoEventosLogic.php?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    console.log(data.agencias);
                    console.log(data.correcto);
                    if (data.correcto && data.agencias) {
                        const agencias = data.agencias;
                        overlay3.innerHTML = "";

                        agencias.forEach(agencia => {
                            const card = document.createElement("div");
                            card.innerHTML = `
                        <div class="cards">
                            <div class="div-info-card">
                                <h2>${agencia.nombre_agencia}</h2>
                                <span class="info-card-ciudad">Total Paquetes: ${agencia.total_paquetes}</span>
                                <span class="info-card-direccion">Remuneración Total: $${parseFloat(agencia.remuneracion_total).toFixed(2)}</span>
                                <button class="btn-revisar" id="br-ag-${agencia.id_agencia}">Revisar Agencia</button>
                            </div>
                            <div class="div-image-card">
                                <img class="image-card" src="${agencia.imagen_url}" alt="Logo de la agencia">
                            </div>
                        </div>`;
                            overlay3.appendChild(card);

                            const reviewButton = card.querySelector(`#br-ag-${agencia.id_agencia}`);
                            reviewButton.addEventListener('click', function () {
                                overlay4.innerHTML = `
                            <div class="maxicard">
                                <h4 class="maxicard-titulo">${agencia.nombre_agencia}</h4>
                                <div class="maxicard-imagen">
                                    <img src="${agencia.imagen_url}" alt="Logo de ${agencia.nombre_agencia}">
                                </div>
                                
                                <div class="maxicard-info-grid">
                                    <p class="maxicard-dato">Teléfono: <span>${agencia.telefono || 'N/A'}</span></p>
                                    <p class="maxicard-dato">Correo: <span>${agencia.correo || 'N/A'}</span></p> 
                                    <p class="maxicard-dato">Dirección: <span>${agencia.direccion || 'N/A'}</span></p> 
                                    <p class="maxicard-dato">Paquetes Registrados: <span>${agencia.total_paquetes}</span></p> 
                                    <p class="maxicard-dato dato-full">Remuneración Global: <span>$${parseFloat(agencia.remuneracion_total).toFixed(2)}</span></p>
                                    <p class="maxicard-dato">ID Agencia: <span>${agencia.id_agencia}</span></p>
                                </div>
                            </div>`;
                            });
                        });
                    } else {
                        overlay3.innerHTML = `<div class="minicard">No se encontraron agencias...</div>`;
                    }
                })
                .catch(error => {
                    overlay3.innerHTML = `<div class="minicard">Error al cargar datos: ${error.message}</div>`;
                });
        } else if (query === 'query15' || query === 'query16') {
            overlay3.innerHTML = `<div class="minicard">Cargando organizadoras...</div>`;
            fetch(`./../../data/logic/infoEventosLogic.php?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.correcto && data.organizadoras) {
                        const organizadoras = data.organizadoras;
                        overlay3.innerHTML = "";

                        organizadoras.forEach(organizadora => {
                            const card = document.createElement("div");
                            card.innerHTML = `
                            <div class="cards">
                                <div class="div-info-card">
                                    <h2>${organizadora.nombre_agencia}</h2>
                                    <span class="info-card-direccion">Remuneración Total: $${parseFloat(organizadora.remuneracion_total).toFixed(2)}</span>
                                    <button class="btn-revisar" id="br-org-${organizadora.id_organizadora}">Revisar Organizadora</button>
                                </div>
                                <div class="div-image-card">
                                    <img class="image-card" src="${organizadora.imagen_url}" alt="Logo de la organizadora">
                                </div>
                            </div>`;
                            overlay3.appendChild(card);

                            const reviewButton = card.querySelector(`#br-org-${organizadora.id_organizadora}`);
                            reviewButton.addEventListener('click', function () {
                                overlay4.innerHTML = `
                                <div class="maxicard">
                                    <h4 class="maxicard-titulo">${organizadora.nombre_agencia}</h4>
                                    <div class="maxicard-imagen">
                                        <img src="${organizadora.imagen_url}" alt="Logo de ${organizadora.nombre_agencia}">
                                    </div>
                                    <div class="maxicard-info-grid">
                                        <p class="maxicard-dato">Teléfono: <span>${organizadora.telefono || 'N/A'}</span></p>
                                        <p class="maxicard-dato">Correo: <span>${organizadora.correo || 'N/A'}</span></p> 
                                        <p class="maxicard-dato">Dirección: <span>${organizadora.direccion || 'N/A'}</span></p>
                                        <p class="maxicard-dato dato-full">Remuneración Global: <span>$${parseFloat(organizadora.remuneracion_total).toFixed(2)}</span></p>
                                        <p class="maxicard-dato">ID Organizadora: <span>${organizadora.id_organizadora}</span></p>
                                    </div>
                                </div>`;
                            });
                        });
                    } else {
                        overlay3.innerHTML = `<div class="minicard">No se encontraron organizadoras...</div>`;
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
        } else if (query === 'query9') {
            overlay3.innerHTML = `<div class="minicard">Cargando filtros y organizadoras...</div>`;

            overlayEx.innerHTML = `
        <div class="query9-filters">
            <select id="select-lugar" class="filter-select">
                <option value="">Lugar</option>
            </select>
            <select id="select-evento" class="filter-select" disabled>
                <option value="">Evento</option>
            </select>
            <select id="select-organizadora" class="filter-select" disabled>
                <option value="">Organizadora</option>
            </select>
        </div>
    `;

            inicializarFiltrosQuery9();

        }
    };
});


const mostrarDetalleOrganizadora = (id_organizadora) => {
    const overlay4 = document.getElementById('overlay4');
    overlay4.innerHTML = `<h4>Cargando detalle de la organizadora ${id_organizadora}...</h4>`;

    fetch(`./../../data/logic/infoEventosLogic.php?query=queryX5&id_organizadora=${id_organizadora}`)
        .then(response => response.json())
        .then(data => {
            if (data.correcto && data.organizadora) {
                const org = data.organizadora;
                const totalRemuneracion = parseFloat(org.remuneracion_total || 0).toFixed(2);
                overlay4.innerHTML = `
                    <div class="maxicard">
                        <h4 class="maxicard-titulo">${org.nombre_agencia} (Organizadora)</h4>
                        <div class="maxicard-imagen">
                            <img src="${org.imagen_url}" alt="Logo de ${org.nombre_agencia}">
                        </div>
                        <div class="maxicard-descripcion">
                            <p>Descripción:</p>
                            <span>${org.descripcion_agencia || 'Sin descripción disponible.'}</span>
                        </div>
                        <div class="maxicard-info-grid">
                            <p class="maxicard-dato">Contacto: <span>${org.correo || 'N/A'}</span></p>
                            <p class="maxicard-dato">Teléfono: <span>${org.telefono || 'N/A'}</span></p>
                            <p class="maxicard-dato">Dirección: <span>${org.direccion || 'N/A'}</span></p>
                            <p class="maxicard-dato">Eventos Registrados: <span>${org.total_eventos || 0}</span></p>

                            <p class="maxicard-dato dato-full">Remuneración Total: <span>$${totalRemuneracion}</span></p>
                            <p class="maxicard-dato dato-full">ID Organizadora: <span>${org.id_organizadora}</span></p>
                        </div>
                    </div>
                `;
            } else {
                overlay4.innerHTML = `<h4>Detalle no encontrado</h4><p>${data.mensaje || 'No se pudo obtener la información de la organizadora.'}</p>`;
            }
        })
        .catch(error => {
            overlay4.innerHTML = `<h4>Error de conexión</h4><p>No se pudo cargar el detalle: ${error.message}</p>`;
        });
}


const inicializarFiltrosQuery9 = () => {
    const selectLugar = document.getElementById('select-lugar');
    const selectEvento = document.getElementById('select-evento');
    const selectOrganizadora = document.getElementById('select-organizadora');

    const cargarOrganizadoras = (filtroOrganizadoraId = '') => {
        let url = `./../../data/logic/infoEventosLogic.php?query=query15`;

        if (filtroOrganizadoraId) {
            url = `./../../data/logic/infoEventosLogic.php?query=queryX4&id_organizadora=${filtroOrganizadoraId}`;
        }

        overlay3.innerHTML = `<div class="minicard">Cargando organizadoras...</div>`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.correcto && data.organizadoras) {
                    const organizadoras = data.organizadoras;
                    overlay3.innerHTML = "";

                    organizadoras.forEach(organizadora => {
                        const card = document.createElement("div");
                        card.innerHTML = `
    <div class="cards">
        <div class="div-info-card">
            <h2>${organizadora.nombre_agencia}</h2>
            <span class="info-card-direccion">Remuneración Total: $${parseFloat(organizadora.remuneracion_total || 0).toFixed(2)}</span>
            <button class="btn-revisar" data-id-organizadora="${organizadora.id_organizadora}">Revisar Organizadora</button> 
        </div>
        <div class="div-image-card">
            <img class="image-card" src="${organizadora.imagen_url}" alt="Logo de la organizadora">
        </div>
    </div>`;
                        overlay3.appendChild(card);
                    });
                    document.querySelectorAll('.btn-revisar').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const idOrg = e.currentTarget.getAttribute('data-id-organizadora');
                            console.log("ID de Organizadora:", idOrg);
                            if (idOrg) {
                                mostrarDetalleOrganizadora(idOrg);
                            } else {
                                console.log("Error: No se detectó el ID de la organizadora.");
                            }
                        });
                    });
                } else {
                    overlay3.innerHTML = `<div class="minicard">No se encontraron organizadoras con este filtro.</div>`;
                }
            })
            .catch(error => {
                overlay3.innerHTML = `<div class="minicard">Error al cargar organizadoras: ${error.message}</div>`;
            });
    };

    fetch(`./../../data/logic/infoEventosLogic.php?query=queryX1`)
        .then(response => response.json())
        .then(data => {
            if (data.correcto && data.lugares) {
                data.lugares.forEach(lugar => {
                    const option = document.createElement('option');
                    option.value = lugar.id_lugar;
                    option.textContent = lugar.nombre_lugar;
                    selectLugar.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error al cargar Lugares:", error));

    cargarOrganizadoras();
    selectLugar.addEventListener('change', () => {
        const idLugar = selectLugar.value;
        selectEvento.innerHTML = '<option value="">Evento</option>';
        selectOrganizadora.innerHTML = '<option value="">Organizadora</option>';
        selectEvento.disabled = true;
        selectOrganizadora.disabled = true;

        if (idLugar) {
            fetch(`./../../data/logic/infoEventosLogic.php?query=queryX2&id_lugar=${idLugar}`)
                .then(response => response.json())
                .then(data => {
                    if (data.correcto && data.eventos) {
                        data.eventos.forEach(evento => {
                            const option = document.createElement('option');
                            option.value = evento.id_evento;
                            option.textContent = evento.nombre_evento;
                            selectEvento.appendChild(option);
                        });
                        selectEvento.disabled = false;
                    }
                })
                .catch(error => console.error("Error al cargar Eventos:", error));
        }
        cargarOrganizadoras();
    });

    selectEvento.addEventListener('change', () => {
        const idEvento = selectEvento.value;
        selectOrganizadora.innerHTML = '<option value="">Organizadora</option>';
        selectOrganizadora.disabled = true;

        if (idEvento) {
            fetch(`./../../data/logic/infoEventosLogic.php?query=queryX3&id_evento=${idEvento}`)
                .then(response => response.json())
                .then(data => {
                    if (data.correcto && data.organizadora) {
                        const organizadora = data.organizadora;
                        const option = document.createElement('option');
                        option.value = organizadora.id_organizadora;
                        option.textContent = organizadora.nombre_agencia;
                        selectOrganizadora.appendChild(option);
                        selectOrganizadora.disabled = false;

                        cargarOrganizadoras(organizadora.id_organizadora);

                    }
                })
                .catch(error => console.error("Error al cargar Organizadora:", error));
        } else {
            cargarOrganizadoras();
        }
    });

    selectOrganizadora.addEventListener('change', () => {
        const idOrganizadora = selectOrganizadora.value;
        if (idOrganizadora) {
            cargarOrganizadoras(idOrganizadora);
        } else {
            cargarOrganizadoras();
        }
    });
};