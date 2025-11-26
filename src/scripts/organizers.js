
let organizadora = JSON.parse(sessionStorage.getItem("organizador_logeado"));

window.addEventListener("load", function () {

    console.log(organizadora)
    const idOrg = organizadora.id_organizadora;

    if (!organizadora) {
        window.location.href = "../../../index.html";
    }


    console.log(organizadora.imagen_url);
    // Configuracion inicial
    document.title = organizadora.nombre_agencia;

    document.getElementById("imgAgencia").src =
        `../../../src/media/images/organizers/${organizadora.imagen_url}`;


    // Obtener número eventos mes
    fetch(`../../data/Logic/organizerController.php?accion=numeroEventosMes&id_organizadora=${idOrg}`)
        .then(res => res.json())
        .then(json => {
            if (json.correcto) {
                document.getElementById("numeroEventos")
                    .innerText = `Numero de eventos este mes: ${json.total}`;
            } else {
                console.error(json.mensaje);
            }
        });

    // Cargar eventos
    let eventos = [];
    fetch(`../../data/Logic/organizerController.php?accion=eventos&id_organizadora=${idOrg}`)
        .then(res => res.json())
        .then(json => {
            if (json.correcto) {
                eventos = json.data;
                filtrarEventos();
            } else {
                console.error(json.mensaje);
            }
        });

    // Variables
    let asc = true;

    const tbody = document.getElementById("eventosBody");
    const buscarNombre = document.getElementById("buscarNombre");
    const buscarLugar = document.getElementById("buscarLugar");
    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");
    const btnOrdenar = document.getElementById("btnOrdenar");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCalendar = document.getElementById("btnCalendar");

    function renderTabla(lista) {
        tbody.innerHTML = "";
        lista.forEach(ev => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Fecha">${ev.fecha_evento}</td>
                <td data-label="Nombre">${ev.nombre_evento}</td>
                <td data-label="Lugar">${ev.lugar || "N/A"}</td>
                <td data-label="Precio">$${ev.precio_boleto}</td>
                <td data-label="Acciones">
                    <button class="btn-modificar" data-id="${ev.id_evento}">Modificar</button>
                    <button class="btn-calendario" data-id="${ev.id_evento}">📅</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


    // Filtrar 
    function filtrarEventos() {
        let filtrados = [...eventos];

        const nombre = buscarNombre.value.toLowerCase();
        const lugar = buscarLugar.value.toLowerCase();
        const inicio = fechaInicio.value ? new Date(fechaInicio.value) : null;
        const fin = fechaFin.value ? new Date(fechaFin.value) : null;

        filtrados = filtrados.filter(e => {
            const fechaEv = new Date(e.fecha_evento);
            const matchNombre = e.nombre_evento.toLowerCase().includes(nombre);
            const matchLugar = (e.lugar || "").toLowerCase().includes(lugar);
            const matchFecha =
                (!inicio || fechaEv >= inicio) &&
                (!fin || fechaEv <= fin);

            return matchNombre && matchLugar && matchFecha;
        });

        // Ordenar por fecha
        filtrados.sort((a, b) =>
            asc
                ? new Date(a.fecha_evento) - new Date(b.fecha_evento)
                : new Date(b.fecha_evento) - new Date(a.fecha_evento)
        );

        renderTabla(filtrados);
    }

    // Eventos input
    [buscarNombre, buscarLugar, fechaInicio, fechaFin].forEach(input => {
        input.addEventListener("input", filtrarEventos);
    });

    // Ordenar
    btnOrdenar.addEventListener("click", () => {
        asc = !asc;
        filtrarEventos();
    });

    btnCalendar.addEventListener("click", () => {

        const fecha = new Date();
        window.dispatchEvent(new CustomEvent("abrirCalendario", {
            detail: {
                month: fecha.getMonth(),
                year: fecha.getFullYear(),
                source: "organizer" //organizer
            }
        }));

    });

    // Botones de la tabla
    tbody.addEventListener("click", (e) => {

        if (e.target.classList.contains("btn-modificar")) {
            this.sessionStorage.setItem("evento_seleccionado", e.target.dataset.id);
            window.location.href = "events.html";

        } else if (e.target.classList.contains("btn-calendario") && e.target.id != "btnCalendar") {

            const evento = eventos.find(ev => ev.id_evento == e.target.dataset.id);
            if (evento) {
                const fecha = new Date(evento.fecha_evento);
                sessionStorage.setItem("evento_seleccionado", evento.id_evento);

                window.dispatchEvent(new CustomEvent("abrirCalendario", {
                    detail: {
                        month: fecha.getMonth(),
                        year: fecha.getFullYear(),
                        source: "event" //organizer,
                    }
                }));
            }
        }

    });

    btnAgregar.addEventListener("click", function () {
        window.location.href = "./add_events.html";
    });

    // Crear el footer y el header
    footer_header();

    function footer_header() {

        fetch("./../../../src/components/header.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data);

                const script = document.createElement("script");
                script.src = "./../../../src/scripts/header_script.js";
                document.body.appendChild(script);

                /*HEADER DINAMICO */
                /*Cambio de la imagen del header */
                const s_header = document.getElementById("s_header");
                s_header.style.backgroundImage = "url(./../../../src/media/images/layout/img_background_header.jpg)";

                /*Cambiar el titulo del header */
                document.getElementById("n_h2").innerText = organizadora.nombre_agencia;
                document.getElementById("s_icon").setAttribute("src", "./../../../src/media/images/icons/icon_arc.png");
                const bnav = document.getElementById("underline_nav");

                /*Agregar los elementos al nav */

                /*Primero*/
                const a1 = document.createElement("a");
                a1.id = "a1";
                a1.href = "#";
                const ai1 = document.createElement("img");
                ai1.src = "./../../../src/media/images/icons/icon_home.png";
                ai1.classList.add("icon_nav");
                a1.appendChild(ai1);
                a1.append("Pagina Principal");
                bnav.appendChild(a1);

                /*Tercero*/
                const a3 = document.createElement("a");
                a3.id = "a3";
                a3.href = "./add_events.html";
                const ai3 = document.createElement("img");
                ai3.src = "./../../../src/media/images/icons/icon_event.png";
                ai3.classList.add("icon_nav");
                a3.appendChild(ai3);
                a3.append("Crear evento");
                bnav.appendChild(a3);

                /*Boton de registro o iniciar sesion*/
                const btn_is_r = document.createElement("button");
                btn_is_r.id = "btn_is_r";
                const btn_a = document.createElement("a");
                const icon_user = document.createElement("img");
                icon_user.src = "./../../../src/media/images/icons/icon_user.png";
                icon_user.classList.add("icon_user");
                btn_a.appendChild(icon_user);
                btn_is_r.appendChild(btn_a);
                bnav.appendChild(btn_is_r);

                btn_is_r.addEventListener("click", () => {
                window.location.href = "../../../index.html";
                });

            });

        fetch("./../../../src/components/footer.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("beforeend", data);

                document.getElementById("f_icon").src =
                    "./../../../src/media/images/icons/icon_arc.png";

                document.querySelector(".f_link").href = "#";

                const f_general = document.getElementById("f_general");
                f_general.style.backgroundImage =
                    "url(./../../../src/media/images/layout/imgLayout20.jpg)";
                f_general.style.backgroundPosition = "50% 80%";
            });

        function img(src) {
            const i = document.createElement("img");
            i.src = src;
            i.classList.add("icon_nav");
            return i;
        }
    }
});
