import {
    obtenerEventoPorID,
    obtenerLugarporID,
    obtenerTipoActividadPorID,
    obtenerTodosLugares,
    obtenerTodosTiposActividad,
    obtenerOrganizadorPorID,
} from "../scripts/dao/daoEventos.js";

import { crearHeader } from "./header.js";
import { crearFooter } from "./footer.js";

// ==== Obtener parámetros de URL ====
const params = new URLSearchParams(window.location.search);
//const idEvento = parseInt(params.get("idEvento"));
const idEvento = 4;  // ID de evento fijo

// ==== Verificar si tenemos un idEvento válido ====
if (!idEvento) {
    alert("No se proporcionó un idEvento en la URL.");
    throw new Error("Falta idEvento");
}




// ==== Referencias a elementos del DOM ====
const img = document.getElementById("event-img");
const nameInput = document.getElementById("event-name");
const descInput = document.getElementById("event-desc");
const timeInput = document.getElementById("event-time");
const priceInput = document.getElementById("event-price");
const placeEl = document.getElementById("event-place");
const typeEl = document.getElementById("event-type");
const organizerEl = document.getElementById("event-organizer");
const organizerImg = document.getElementById("event-organizer-img");

// ==== Crear mini calendario (botón pequeño) ====
const miniCalendar = document.getElementById("event-calendar");


// ==== Cargar datos del evento ====
async function cargarEvento() {
    try {

        // ==== Para pruebas rapidas - Borrar luego ====
        if (!sessionStorage.getItem("currentProfile")) {
            sessionStorage.setItem("currentProfile", "2"); // organizadora 1 por defecto
        }

        const currentProfile = parseInt(sessionStorage.getItem("currentProfile"));

        // Hasta aqui lleg

        const eventoData = await obtenerEventoPorID(idEvento);
        const evento = eventoData;

        if (!evento) {
            alert("No se encontró el evento.");
            return;
        }

        console.log(evento.id_organizadora);
        console.log(currentProfile);

        const editable = evento.id_organizadora === currentProfile;
        console.log(editable);

        // Obtener datos relacionados
        const [lugarData, tipoData, organizadorData] = await Promise.all([
            obtenerLugarporID(evento.id_lugar),
            obtenerTipoActividadPorID(evento.id_tipo_actividad),
            obtenerOrganizadorPorID(evento.id_organizadora),
        ]);

        const lugar = lugarData[0];
        const tipo = tipoData[0];
        const organizador = organizadorData;

        // Mostrar imagen
        img.src = `/src/media/images/events/${evento.imagen_url}`;
        img.alt = evento.nombre_evento;

        // Llenar campos
        nameInput.value = evento.nombre_evento;
        descInput.value = evento.descripcion;
        timeInput.value = evento.hora_evento;
        priceInput.value = evento.precio_boleto;
        placeEl.textContent = lugar ? lugar.nombre_lugar : "Lugar no encontrado";
        typeEl.textContent = tipo ? tipo.nombre_tipo_actividad : "Tipo no encontrado";
        organizerEl.textContent = organizador
            ? `Organizado por: ${organizador.nombre_agencia}`
            : "Organizador desconocido";
        organizerImg.style.backgroundImage = `url(/src/media/images/organizers/${organizador.image_url})`;

        // Si no puede editar, bloquear inputs
        if (!editable) {
            [nameInput, descInput, timeInput, priceInput].forEach(
                (el) => (el.disabled = true)
            );
        } else {
            // ==== Permitir cambiar imagen ====
            img.style.cursor = "pointer";
            img.title = "Click para cambiar imagen";
            img.addEventListener("click", () => {
                const nueva = prompt("Introduce el nombre del archivo de imagen (ejemplo: 4.jpg)");
                if (nueva) img.src = `/src/media/images/events/${nueva}`;
            });

            // ==== Click para editar lugar ====
            placeEl.style.cursor = "pointer";
            placeEl.title = "Haz clic para cambiar el lugar";
            placeEl.addEventListener("click", async () => {
                const lugares = await obtenerTodosLugares();
                mostrarModalSeleccion("Selecciona un lugar", lugares, "nombre_lugar", (sel) => {
                    placeEl.textContent = sel.nombre_lugar;
                });
            });

            // ==== Click para editar tipo ====
            typeEl.style.cursor = "pointer";
            typeEl.title = "Haz clic para cambiar el tipo de actividad";
            typeEl.addEventListener("click", async () => {
                const tipos = await obtenerTodosTiposActividad();
                mostrarModalSeleccion("Selecciona un tipo de actividad", tipos, "nombre_tipo_actividad", (sel) => {
                    typeEl.textContent = sel.nombre_tipo_actividad;
                });
            });
        }


        crearHeader({
            titulo: `${evento.nombre_evento}`,
            icono: "/src/media/images/icons/icon_arc.png",
            background: "/src/media/images/layout/img_background_header.jpg",
            navItems: [
                { id: "a1", href: "#", icon: "/src/media/images/icons/icon_home.png", texto: "Inicio" },
                { id: "a2", href: "#", icon: "/src/media/images/icons/icon_travel.png", texto: "Destinos" },
                { id: "a3", href: "#", icon: "/src/media/images/icons/icon_event.png", texto: "Eventos" }
            ],
            btnLogin: true
        });

        crearFooter({
            icono: "../../media/images/icons/icon_arc.png",
            background: "../../media/images/layout/imgLayout20.jpg",
            linkAbout: "#",
            posicionFondo: "50% 80%"
        });

        // ==== Mini calendario interactivo ====
        const fechaEvento = new Date(evento.fecha_evento);
        miniCalendar.addEventListener("click", () => {
            console.log("jala");
            // Pasamos el evento al calendario global
            window.eventosCalendario = [evento];
            console.log("jala 2");
            window.dispatchEvent(

                new CustomEvent("abrirCalendario", {
                    detail: { month: fechaEvento.getMonth(), year: fechaEvento.getFullYear() },
                })
            );
            document.getElementById("calendar-modal").classList.add("active");
        });
    } catch (error) {
        console.error("Error al cargar el evento:", error);
    }
}

cargarEvento();

// ==== Modal genérico para selección ====
function mostrarModalSeleccion(titulo, lista, campoNombre, callback) {
    let modal = document.getElementById("modal-seleccion");
    if (modal) modal.remove();

    modal = document.createElement("div");
    modal.id = "modal-seleccion";
    modal.className = "day-info-modal active";

    const overlay = document.createElement("div");
    overlay.className = "day-info-overlay";

    const content = document.createElement("div");
    content.className = "day-info-content";
    content.innerHTML = `<button class="day-info-close">×</button><h2>${titulo}</h2>`;

    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.textAlign = "left";
    list.style.padding = "0";

    lista.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item[campoNombre];
        li.style.cursor = "pointer";
        li.style.padding = "8px";
        li.addEventListener("click", () => {
            callback(item);
            modal.remove();
        });
        list.appendChild(li);
    });

    content.appendChild(list);
    modal.appendChild(overlay);
    modal.appendChild(content);
    document.body.appendChild(modal);

    const closeBtn = content.querySelector(".day-info-close");
    closeBtn.addEventListener("click", () => modal.remove());
    overlay.addEventListener("click", () => modal.remove());
}

