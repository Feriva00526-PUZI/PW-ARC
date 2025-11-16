// calendar.js
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

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function obtenerEventosMes(month, year) {
  const eventos = window.eventosCalendario || [];
  return eventos.filter(ev => {
    const fecha = new Date(ev.fecha_evento);
    return fecha.getMonth() === month && fecha.getFullYear() === year;
  });
}

function renderCalendar(month, year) {
  daysContainer.innerHTML = "";
  currentMonth = month;
  currentYear = year;

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  currentDateLabel.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventosMes = obtenerEventosMes(month, year);

  for (let i = 0; i < startDay; i++) {
    const li = document.createElement("li");
    li.classList.add("empty");
    daysContainer.appendChild(li);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const li = document.createElement("li");
    li.textContent = day;

    const evento = eventosMes.find(e => new Date(e.fecha_evento).getDate() === day);
    if (evento) {
      li.classList.add("event-day");
      li.addEventListener("click", () => openDayInfo(evento));
    }

    daysContainer.appendChild(li);
  }

  // Rellenar 6 filas (42 celdas)
  while (daysContainer.children.length < 42) {
    const li = document.createElement("li");
    li.classList.add("empty");
    daysContainer.appendChild(li);
  }
}

function openDayInfo(evento) {
  dayInfoTitle.textContent = `${evento.nombre_evento} (${evento.fecha_evento})`;
  dayInfoDescription.innerHTML = 
  `
  <img src = "/src/media/images/events/${evento.imagen_url}" >
  <p>Lugar: ${evento.id_lugar}</p>
  <p>Fecha: ${evento.descripcion}</p>
  <p>Hora: ${evento.descripcion}</p>
  <p>Precio: $${evento.precio_boleto}</p`;


  dayInfoModal.classList.add("active");
}

function closeModal(modalElement) {
  modalElement.classList.add("closing");
  setTimeout(() => modalElement.classList.remove("active", "closing"), 250);
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

// Escucha desde organizers.js
window.addEventListener("abrirCalendario", (e) => {
  const { month, year } = e.detail;
  renderCalendar(month, year);
  modal.classList.add("active");
});
