// ============================================================
// REFERENCIAS DOM
// ============================================================
const daysContainer = document.querySelector(".calendar__days");
const currentDateLabel = document.getElementById("calendar-date");
const btnNext = document.querySelector(".calendar__button--next");
const btnPrev = document.querySelector(".calendar__button--previous");

const modal = document.getElementById("calendar-modal");
const modalClose = document.querySelector(".calendar-modal__close");
const modalOverlay = document.querySelector(".calendar-modal__overlay");

const dayInfoModal = document.getElementById("day-info-modal");
const dayInfoClose = document.querySelector(".day-info-close");
const dayInfoOverlay = document.querySelector(".day-info-overlay");
const dayInfoTitle = document.getElementById("day-info-title");
const dayInfoDescription = document.getElementById("day-info-description");

let eventos = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDay = null;

window.calendarState = {
  selectedDay: null
};

// ============================================================
// UTILIDAD: Normalizar arrays
// ============================================================
function normalizeEventos(data) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

// ============================================================
// UTILIDAD: Obtener los dias seleccionados
// ============================================================
function obtenerDiaSeleccionado() {
  return selectedDay;
}

// ============================================================
// UTILIDAD: Parsear fecha SIEMPRE como LOCAL (no UTC)
// ============================================================
function parseFechaLocal(fecha) {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ============================================================
// OBTENER EVENTOS DEL MES
// ============================================================
function obtenerEventosMes(month, year) {
  return eventos.filter(ev => {
    const f = ev.fechaLocal;
    return f.getMonth() === month && f.getFullYear() === year;
  });
}

// ============================================================
// RENDER CALENDARIO
// ============================================================
function renderCalendar(month, year) {
  daysContainer.innerHTML = "";
  currentMonth = month;
  currentYear = year;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  currentDateLabel.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventosMes = obtenerEventosMes(month, year);

  const admin = JSON.parse(sessionStorage.getItem("organizador_logeado"));
  const esOrganizador = Boolean(admin);

  // espacios vacíos antes
  for (let i = 0; i < startDay; i++) {
    let li = document.createElement("li");
    li.classList.add("empty");
    daysContainer.appendChild(li);
  }

  // días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const li = document.createElement("li");
    li.textContent = day;

    const eventosDelDia = eventosMes.filter(
      e => e.fechaLocal.getDate() === day
    );

    // ========== MODO DE SELECCIÓN DE DÍAS ==========
    li.addEventListener("click", (e) => {
      // Evita que abrir modales interfiera (solo seleccion)
      e.stopPropagation();

      // Quitar seleccion previa
      const prev = document.querySelector(".selected-day");
      if (prev) prev.classList.remove("selected-day");

      // Marcar nuevo seleccionado
      li.classList.add("selected-day");

      // Guardar valores actuales
      window.calendarState.selectedDay = {
        day,
        month: currentMonth + 1,
        year: currentYear
      };


      console.log("Día seleccionado:", window.calendarState.selectedDay);
    });


    // ------------------------------------------------------------
    // DÍA CON EVENTOS
    // ------------------------------------------------------------
    if (eventosDelDia.length > 0) {
      li.classList.add("event-day");

      // === 1 solo evento -> comportamiento como antes
      if (eventosDelDia.length === 1) {
        const ev = eventosDelDia[0];
        li.style.backgroundImage = `url('../../media/images/events/${ev.imagen_url}')`;

        li.addEventListener("click", () => openDayInfo(ev));

        if (esOrganizador) {
          li.draggable = true;
          li.dataset.eventoId = ev.id_evento;

          li.addEventListener("dragstart", (evDrag) => {
            evDrag.dataTransfer.setData("id_evento", ev.id_evento);
            evDrag.dataTransfer.setData("fecha_original", ev.fecha_evento);
          });
        }
      }

      // === varios eventos -> Opción B: hacer el día draggable, pero seguir permitiendo ver lista
      else {
        li.classList.add("multi-event");
        li.innerHTML = `${day} <span class="event-count">(${eventosDelDia.length})</span>`;

        // Al hacer clic mostramos la lista (visualizar / abrir selector)
        li.addEventListener("click", () => showEventSelector(eventosDelDia));

        if (esOrganizador) {
          // Hacemos el <li> arrastrable como representante del conjunto del día
          li.draggable = true;

          // Guardamos en dataset los ids de eventos del día (como JSON)
          li.dataset.eventos = JSON.stringify(eventosDelDia.map(ev => ev.id_evento));
          // Y la fecha original en formato YYYY-MM-DD
          li.dataset.fecha_original = eventosDelDia[0].fecha_evento.split(" ")[0];

          li.addEventListener("dragstart", (evDrag) => {
            // Cuando se inicia drag desde un día con multiples eventos, enviamos la lista de ids
            evDrag.dataTransfer.setData("multi_eventos", li.dataset.eventos);
            evDrag.dataTransfer.setData("fecha_original", li.dataset.fecha_original);
            // También podemos enviar un texto para compatibilidad
            evDrag.dataTransfer.setData("text/plain", `Mover eventos: ${li.dataset.eventos}`);
          });
        }
      }
    }

    // ------------------------------------------------------------
    // DROP TARGET
    // ------------------------------------------------------------
    if (esOrganizador) {
      li.addEventListener("dragover", (ev) => ev.preventDefault());

      li.addEventListener("drop", async (evDrop) => {
        evDrop.preventDefault();

        // 1) Si viene un id_evento simple (drag de un único evento)
        const idEvento = evDrop.dataTransfer.getData("id_evento");
        if (idEvento) {
          await moverEventoPorId(idEvento, month, day);
          return;
        }

        // 2) Si viene un conjunto (drag desde un día multi-event)
        const multi = evDrop.dataTransfer.getData("multi_eventos");
        if (multi) {
          let ids;
          try {
            ids = JSON.parse(multi);
            if (!Array.isArray(ids) || ids.length === 0) return;
          } catch (err) {
            console.error("Error parseando multi_eventos:", err);
            return;
          }

          // Construir nueva fecha destino
          const nuevaFecha = `${currentYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          // Mostrar selector para elegir cuál de esos ids mover al nuevaFecha
          const listaEventos = ids.map(id => eventos.find(ev => ev.id_evento == id)).filter(Boolean);

          if (listaEventos.length === 0) return;

          // Abrimos un modal que permita elegir cuál mover al nuevaFecha
          showMoveSelector(listaEventos, nuevaFecha);
          return;
        }

        // Si no viene ni id ni multi, no hacemos nada
      });
    }

    daysContainer.appendChild(li);
  }

  // completar a 42 celdas
  while (daysContainer.children.length < 42) {
    let li = document.createElement("li");
    li.classList.add("empty");
    daysContainer.appendChild(li);
  }
}

// ============================================================
// MOVIMIENTO: mover evento por ID (usa backend y actualiza local)
// ============================================================
async function moverEventoPorId(idEvento, monthDestino, dayDestino) {
  const nuevaFecha = `${currentYear}-${String(monthDestino + 1).padStart(2, "0")}-${String(dayDestino).padStart(2, "0")}`;

  if (!confirm(`¿Mover el evento al ${nuevaFecha}?`)) return;

  try {
    const res = await fetch(`../../data/Logic/calendarController.php`, {
      method: "POST",
      body: new URLSearchParams({
        accion: "actualizarFecha",
        id_evento: idEvento,
        nueva_fecha: nuevaFecha
      })
    });

    const json = await res.json();

    if (json.correcto) {
      const index = eventos.findIndex(e => e.id_evento == idEvento);
      if (index !== -1) {
        eventos[index].fecha_evento = nuevaFecha;
        eventos[index].fechaLocal = parseFechaLocal(nuevaFecha);
      }
      renderCalendar(currentMonth, currentYear);
    } else {
      alert("Error al actualizar fecha: " + json.mensaje);
    }
  } catch (err) {
    console.error("Error al mover evento:", err);
    alert("Error de red al mover el evento.");
  }
}

// ============================================================
// MODAL PARA SELECCIÓN DE EVENTO 
// ============================================================
function showEventSelector(lista) {
  dayInfoTitle.textContent = "Eventos del día";

  dayInfoDescription.innerHTML = lista
    .map(ev => `
      <div class="event-option" data-id="${ev.id_evento}">
        <img src="../../media/images/events/${ev.imagen_url}">
        <div>
          <h4>${ev.nombre_evento}</h4>
          <p>${ev.hora_evento}</p>
        </div>
      </div>
    `).join("");

  dayInfoDescription.querySelectorAll(".event-option").forEach(el => {
    el.addEventListener("click", () => {
      const ev = lista.find(e => e.id_evento == el.dataset.id);
      openDayInfo(ev);
    });
  });

  dayInfoModal.classList.add("active");
}

// ============================================================
// MODAL PARA SELECCIÓN DE QUÉ EVENTO MOVER (SE ABRE AL SOLTAR UN DÍA MULTI)
// ============================================================
function showMoveSelector(lista, nuevaFecha) {
  dayInfoTitle.textContent = `Selecciona evento a mover a ${nuevaFecha}`;

  dayInfoDescription.innerHTML = lista
    .map(ev => `
      <div class="event-option-move" data-id="${ev.id_evento}">
        <img src="../../media/images/events/${ev.imagen_url}">
        <div>
          <h4>${ev.nombre_evento}</h4>
          <p>${ev.hora_evento}</p>
          <p><small>${ev.id_lugar || ""}</small></p>
        </div>
        <div>
          <button class="move-now" data-id="${ev.id_evento}">Mover aquí</button>
        </div>
      </div>
    `).join("");

  // Asociar eventos a los botones de mover
  dayInfoDescription.querySelectorAll(".move-now").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.dataset.id;
      // Ejecutar la petición de mover al backend y actualizar localmente
      try {
        const res = await fetch(`../../data/Logic/calendarController.php`, {
          method: "POST",
          body: new URLSearchParams({
            accion: "actualizarFecha",
            id_evento: id,
            nueva_fecha: nuevaFecha
          })
        });

        const json = await res.json();

        if (json.correcto) {
          const index = eventos.findIndex(ev => ev.id_evento == id);
          if (index !== -1) {
            eventos[index].fecha_evento = nuevaFecha;
            eventos[index].fechaLocal = parseFechaLocal(nuevaFecha);
          }
          closeModal(dayInfoModal);
          renderCalendar(currentMonth, currentYear);
        } else {
          alert("Error al actualizar fecha: " + json.mensaje);
        }
      } catch (err) {
        console.error("Error al mover evento:", err);
        alert("Error de red al mover el evento.");
      }
    });
  });

  dayInfoModal.classList.add("active");
}

// ============================================================
// MODAL INFO EVENTO
// ============================================================
function openDayInfo(evento) {
  dayInfoTitle.textContent = evento.nombre_evento;

  dayInfoDescription.innerHTML = `
    <img src="../../media/images/events/${evento.imagen_url}" alt="">
    <div class="day-info__details">
      <p><strong>Lugar:</strong> ${evento.nombre_lugar}</p>
      <p><strong>Fecha:</strong> ${evento.fecha_evento}</p>
      <p><strong>Hora:</strong> ${evento.hora_evento}</p>
    </div>
    <p>${evento.descripcion}</p>
    <p class="day-info__price">Precio: $${evento.precio_boleto}</p>
  `;

  dayInfoModal.classList.add("active");
}

// ============================================================
// CERRAR MODALES
// ============================================================
function closeModal(m) {
  m.classList.add("closing");
  setTimeout(() => m.classList.remove("active", "closing"), 250);
}

dayInfoClose.addEventListener("click", () => closeModal(dayInfoModal));
dayInfoOverlay.addEventListener("click", () => closeModal(dayInfoModal));
modalClose.addEventListener("click", () => closeModal(modal));
modalOverlay.addEventListener("click", () => closeModal(modal));

btnNext.addEventListener("click", () => {
  currentMonth = (currentMonth + 1) % 12;
  if (currentMonth === 0) currentYear++;
  renderCalendar(currentMonth, currentYear);
});

btnPrev.addEventListener("click", () => {
  currentMonth = (currentMonth - 1 + 12) % 12;
  if (currentMonth === 11) currentYear--;
  renderCalendar(currentMonth, currentYear);
});

// ============================================================
// EVENTO CUANDO SE ABRE EL CALENDARIO
// ============================================================
window.addEventListener("abrirCalendario", async (e) => {
  modal.classList.add("active");

  const { month, year, source } = e.detail;

  // ========================================================
  // Carga de EVENTO individual
  // ========================================================
  if (source === "event") {
    const idEvento = sessionStorage.getItem("evento_seleccionado");

    const res = await fetch(
      `../../data/Logic/calendarController.php?accion=eventoPorID&id_evento=${idEvento}`
    );

    const json = await res.json();
    eventos = normalizeEventos(json.data);

    // Normalizar fechas
    eventos = eventos.map(ev => {
      const soloFecha = ev.fecha_evento.split(" ")[0];
      return {
        ...ev,
        fecha_evento: soloFecha,
        fechaLocal: parseFechaLocal(soloFecha)
      };
    });

    renderCalendar(month, year);
    return;
  }

  // ========================================================
  // Carga de SELECTOR de dia
  // ========================================================
  if (source === "selection") {

    let month = new Date().getMonth();
    let year = new Date().getFullYear();

    renderCalendar(month, year);
    return;
  }

  // ========================================================
  // Carga del ORGANIZADOR
  // ========================================================
  if (source === "organizer") {
    const admin = JSON.parse(sessionStorage.getItem("organizador_logeado"));

    const res = await fetch(
      `../../data/Logic/calendarController.php?accion=eventosCalendario&id_organizadora=${admin.id_organizadora}`
    );

    const json = await res.json();
    eventos = normalizeEventos(json.data);

    // Normalizar fechas
    eventos = eventos.map(ev => {
      const soloFecha = ev.fecha_evento.split(" ")[0];
      return {
        ...ev,
        fecha_evento: soloFecha,
        fechaLocal: parseFechaLocal(soloFecha)
      };
    });

    renderCalendar(month, year);
    return;
  }

  eventos = [];
  renderCalendar(month, year);
});
