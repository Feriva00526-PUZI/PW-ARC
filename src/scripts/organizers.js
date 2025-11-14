import { obtenerEventosPorOrganizadora, obtenerNumeroEventosEsteMes } from "./dao/daoEventos.js";

window.addEventListener("load", async function () {
    let organizadora = JSON.parse(sessionStorage.getItem("organizador_logeado"));

    if (!organizadora) {
        const response = await fetch("../../data/organizers.json");
        const data = await response.json();
    }

    document.title = organizadora.nombre_agencia;
    document.getElementById("imgAgencia").src = `../../media/images/organizers/${organizadora.image_url}`;

    // === Obtener y mostrar el número de eventos de este mes ===
    let numeroEventos = await obtenerNumeroEventosEsteMes(organizadora.id_organizadora);
    document.getElementById("numeroEventos").innerText = `Numero de eventos este mes: ${numeroEventos}`;

    // === Cargar eventos desde DAO ===
    let eventos = await obtenerEventosPorOrganizadora(organizadora.id_organizadora);
    window.eventosCalendario = eventos; // para el calendario

    // Estado de orden
    let asc = true;

    const tbody = document.getElementById("eventosBody");
    const buscarNombre = document.getElementById("buscarNombre");
    const buscarLugar = document.getElementById("buscarLugar");
    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");
    const btnOrdenar = document.getElementById("btnOrdenar");

    function renderTabla(lista) {
        tbody.innerHTML = "";
        lista.forEach(ev => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${ev.fecha_evento}</td>
        <td>${ev.nombre_evento}</td>
        <td>${ev.lugar || "N/A"}</td>
        <td>$${ev.precio_boleto}</td>
        <td>
          <button class="btn-modificar" data-id="${ev.id_evento}">Modificar</button>
          <button class="btn-cancelar" data-id="${ev.id_evento}">Cancelar</button>
          <button class="btn-calendario" data-id="${ev.id_evento}">📅</button>
        </td>
      `;
            tbody.appendChild(tr);
        });
    }

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
            const matchFecha = (!inicio || fechaEv >= inicio) && (!fin || fechaEv <= fin);
            return matchNombre && matchLugar && matchFecha;
        });

        filtrados.sort((a, b) => asc
            ? new Date(a.fecha_evento) - new Date(b.fecha_evento)
            : new Date(b.fecha_evento) - new Date(a.fecha_evento)
        );

        renderTabla(filtrados);
    }

    [buscarNombre, buscarLugar, fechaInicio, fechaFin].forEach(input => {
        input.addEventListener("input", filtrarEventos);
    });

    btnOrdenar.addEventListener("click", () => {
        asc = !asc;
        filtrarEventos();
    });

    tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-cancelar")) {
            const id = e.target.dataset.id;
            if (confirm("¿Seguro que deseas cancelar este evento?")) {
                eventos = eventos.filter(ev => ev.id_evento != id);
                filtrarEventos();
            }
        } else if (e.target.classList.contains("btn-modificar")) {
            alert(`Función para modificar evento ID: ${e.target.dataset.id}`);
        } else if (e.target.classList.contains("btn-calendario")) {
            const evento = eventos.find(ev => ev.id_evento == e.target.dataset.id);
            if (evento) {
                // abre el calendario con el mes del evento
                const fecha = new Date(evento.fecha_evento);
                window.dispatchEvent(new CustomEvent("abrirCalendario", {
                    detail: { month: fecha.getMonth(), year: fecha.getFullYear() }
                }));
            }
        }
    });

    filtrarEventos();
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
                /*Segundo*/
                const a2 = document.createElement("a");
                a2.id = "a2";
                a2.href = "#";
                const ai2 = document.createElement("img");
                ai2.src = "./../../../src/media/images/icons/icon_travel.png";
                ai2.classList.add("icon_nav");
                a2.appendChild(ai2);
                a2.append("Lugares Populares");
                bnav.appendChild(a2);
                /*Tercero*/
                const a3 = document.createElement("a");
                a3.id = "a3";
                a3.href = "#";
                const ai3 = document.createElement("img");
                ai3.src = "./../../../src/media/images/icons/icon_event.png";
                ai3.classList.add("icon_nav");
                a3.appendChild(ai3);
                a3.append("Eventos Recientes");
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

                const select_login = document.getElementById("select_login");
                btn_is_r.addEventListener("click", function () {
                    select_login.showModal();
                });
            });

        /*Copiar y pegar eso para añadir el footer en la pagina que sea */
        fetch("./../../../src/components/footer.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("beforeend", data);

                /*Cambio del icono ARC (Solo para actualizar la ruta relativa) */
                document.getElementById("f_icon").setAttribute("src", "./../../../src/media/images/icons/icon_arc.png");

                /*Cambio link del boton hacia la pagina About Us (Solo para actualizar la ruta relativa) */
                document.querySelector(".f_link").href = "#";

                /*Cambio de la imagen del footer derecho*/
                const f_general = document.getElementById("f_general");
                f_general.style.backgroundImage = "url(./../../../src/media/images/layout/img_background_footer.jpeg)";
                f_general.style.backgroundImage = "url(./../../../src/media/images/layout/imgLayout20.jpg)";
                /*Cambiar que parte de la imagen se ve, el primer 50 es horizontalmente(no cambiarlo) y el segundo es para la altura que se visualiza */
                f_general.style.backgroundPosition = "50% 80%";
            });

    }
});
