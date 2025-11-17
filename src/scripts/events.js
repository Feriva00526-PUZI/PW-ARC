let idEvento = sessionStorage.getItem("evento_seleccionado");

if (!idEvento) {
    window.location.href = "../../../index.html";
}

// ==== Referencias DOM ====
const img = document.getElementById("event-img");
const nameInput = document.getElementById("event-name");
const descInput = document.getElementById("event-desc");
const timeInput = document.getElementById("event-time");
const priceInput = document.getElementById("event-price");
const placeEl = document.getElementById("event-place");
const typeEl = document.getElementById("event-type");
const organizerEl = document.getElementById("event-organizer");
const organizerImg = document.getElementById("event-organizer-img");
const miniCalendar = document.getElementById("event-calendar");

let evento = null;
let lugar = null;
let organizador = null;
let tipoActividad = null;

// Tu usuario logeado
let currentProfile = JSON.parse(sessionStorage.getItem("organizador_logeado"));


// ==== Cargar datos del evento ====
window.addEventListener("load", async function () {

    try {
        // 1️⃣ Obtener evento
        const res = await fetch(`../../data/Logic/eventController.php?accion=evento&idEvento=${idEvento}`);
        const json = await res.json();

        if (!json.correcto) throw new Error(json.mensaje);

        evento = json.data;

        // 2️⃣ Obtener lugar
        const resLugar = await fetch(`../../data/Logic/eventController.php?accion=lugar&idLugar=${evento.id_lugar}`);
        const jsonLugar = await resLugar.json();
        if (jsonLugar.correcto) lugar = jsonLugar.data;

        // 3️⃣ Obtener organizador
        const resOrg = await fetch(`../../data/Logic/eventController.php?accion=organizadora&idOrganizadora=${evento.id_organizadora}`);
        const jsonOrg = await resOrg.json();
        if (jsonOrg.correcto) organizador = jsonOrg.data;
        
        const resTipoA = await fetch(`../../data/Logic/eventController.php?accion=actividad&idActividad=${evento.id_tipo_actividad}`);
        const jsonTipoA = await resTipoA.json();
        if (jsonTipoA.correcto) tipoActividad = jsonTipoA.data;


        cargarEvento();

    } catch (e) {
        console.error("Error:", e);
    }
});
//src\media\images\events\eimg1.png

// =====================================================
// Cargar datos en la interfaz
// =====================================================
function cargarEvento() {
    try {
        const editable = evento.id_organizadora === currentProfile.id_organizadora;

        console.log(evento.imagen_url);
        // Imagen
        img.src = `../../../src/media/images/events/${evento.imagen_url}`;
        img.alt = evento.nombre_evento;

        // Inputs
        nameInput.value = evento.nombre_evento;
        descInput.value = evento.descripcion;
        timeInput.value = evento.hora_evento;
        priceInput.value = evento.precio_boleto;

        // Tarjetas
        placeEl.textContent = lugar ? lugar.nombre_lugar : "Lugar no encontrado";
        typeEl.textContent = tipoActividad.nombre_tipo_actividad ?? "Tipo no encontrado";

        organizerEl.textContent = organizador
            ? `Organizado por: ${organizador.nombre_agencia}`
            : "Organizador desconocido";

        if (organizador?.image_url) {
            organizerImg.style.backgroundImage =
                `url(../../../src/media/images/organizers/${organizador.image_url})`;
        }

        // Si NO puede editar → bloquear
        if (!editable) {
            [nameInput, descInput, timeInput, priceInput].forEach(el => el.disabled = true);
            return; // Ya no activar los listeners
        }

        // Imagen editable
        img.style.cursor = "pointer";
        img.title = "Click para cambiar imagen";
        img.addEventListener("click", () => {
            const nueva = prompt("Introduce el nombre del archivo (ej: 4.jpg)");
            if (nueva) img.src = `/src/media/images/events/${nueva}`;
        });

        // Lugar seleccionable
        placeEl.style.cursor = "pointer";
        placeEl.title = "Haz clic para cambiar el lugar";
        placeEl.addEventListener("click", async () => {
            const lugares = await obtenerTodosLugares(); // ← Debes tener esta función aparte
            mostrarModalSeleccion("Selecciona un lugar", lugares, "nombre_lugar", (sel) => {
                placeEl.textContent = sel.nombre_lugar;
                lugar = sel;
            });
        });

        // Tipo seleccionable
        typeEl.style.cursor = "pointer";
        typeEl.title = "Haz clic para cambiar el tipo";
        typeEl.addEventListener("click", async () => {
            const tipos = await obtenerTodosTiposActividad(); // ← También debes tener esta función
            mostrarModalSeleccion("Selecciona un tipo de actividad", tipos, "nombre_tipo_actividad", (sel) => {
                typeEl.textContent = sel.nombre_tipo_actividad;
            });
        });

        // Mini calendario
        const fechaEvento = new Date(evento.fecha_evento);

        miniCalendar.addEventListener("click", () => {
            window.eventosCalendario = [evento];

            window.dispatchEvent(
                new CustomEvent("abrirCalendario", {
                    detail: {
                        month: fechaEvento.getMonth(),
                        year: fechaEvento.getFullYear(),
                        source: "event"
                    },
                })
            );

            document.getElementById("calendar-modal").classList.add("active");
        });

    } catch (error) {
        console.error("Error en cargarEvento():", error);
    }
}




// =====================================================
// Modal genérico
// =====================================================
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
    content.innerHTML = `
        <button class="day-info-close">×</button>
        <h2>${titulo}</h2>
    `;

    const list = document.createElement("ul");
    list.style.listStyle = "none";
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

    content.querySelector(".day-info-close").addEventListener("click", () => modal.remove());
    overlay.addEventListener("click", () => modal.remove());
}
