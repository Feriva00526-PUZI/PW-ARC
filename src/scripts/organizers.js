import { crearHeader } from "./header.js";
import { crearFooter } from "./footer.js";
import { obtenerEventosPorOrganizadora, obtenerNumeroEventosEsteMes } from "./dao/daoEventos.js";

window.addEventListener("load", async function () {
    let organizadora = JSON.parse(sessionStorage.getItem("organizadoraActiva"));

    if (!organizadora) {
        const response = await fetch("../../data/organizers.json");
        const data = await response.json();
        organizadora = data[0];
        sessionStorage.setItem("organizadoraActiva", JSON.stringify(organizadora));
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

    crearHeader({
        titulo: `${organizadora.nombre_agencia}`,
        icono: "../../media/images/icons/icon_arc.png",
        background: "../../media/images/layout/img_background_header.jpg",
        navItems: [
            { id: "a1", href: "#", icon: "../../media/images/icons/icon_home.png", texto: "Inicio" },
            { id: "a2", href: "#", icon: "../../media/images/icons/icon_travel.png", texto: "Destinos" },
            { id: "a3", href: "#", icon: "../../media/images/icons/icon_event.png", texto: "Eventos" }
        ],
        btnLogin: true
    });

    crearFooter({
        icono: "../../media/images/icons/icon_arc.png",
        background: "../../media/images/layout/imgLayout20.jpg",
        linkAbout: "#",
        posicionFondo: "50% 80%"
    });
});
