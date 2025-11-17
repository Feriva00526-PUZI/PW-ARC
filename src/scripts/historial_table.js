function getStatusClass(status) {
 const s = (status || "").toLowerCase();

 if (s === "pendiente") return "status-en-espera badge";
 if (s === "cancelado") return "status-cancelado badge";
 if (s === "completado") return "status-realizado badge";

 return "status-en-espera badge";
}

function initHistorialTable(data) {
 const tbody = document.querySelector("#hist-table-sample tbody");
 tbody.innerHTML = "";

 data.forEach(item => {
 const tr = document.createElement("tr");

 // id_paquete (Esta celda se usaba para el destino en tu captura)
  const tdId = document.createElement("td");
  tdId.textContent = item.id_paquete;

  // nombre del paquete (INNER JOIN)
  const tdPaquete = document.createElement("td");
  tdPaquete.textContent = item.nombre_paquete + " - " + item.nombre_lugar;

  // Estado
  const tdEstado = document.createElement("td");
  const divEstado = document.createElement("div");
  divEstado.textContent = item.estado;
  divEstado.className = getStatusClass(item.estado);
  tdEstado.appendChild(divEstado);

  // Fecha
  const tdFecha = document.createElement("td");
  tdFecha.textContent = item.fecha_viaje;

  // Hora
  const tdHora = document.createElement("td");
  tdHora.textContent = item.hora_viaje;

  // Acciones
  // Descripcion
  const tdAcciones = document.createElement("td");
  const btnDescripcion = document.createElement("button");
  btnDescripcion.className = "hist-btn hist-btn-desc";
  btnDescripcion.textContent = "Descripción";
// Cancelar
const btnCancelar = document.createElement("button");
btnCancelar.className = "hist-btn hist-btn-cancel";
btnCancelar.textContent = "Cancelar";

 btnDescripcion.addEventListener("click", () => {
 alert(
 "Paquete: " + item.nombre_paquete + "\n" +
 "Lugar: " + item.nombre_lugar + "\n" +
 "Ciudad: " + item.ciudad + "\n" +
"Estado: " + item.estado + "\n" +
 "Fecha: " + item.fecha_viaje + "\n" +
 "Hora: " + item.hora_viaje
 );
 });

 tdAcciones.appendChild(btnDescripcion);

 // Añadir las celdas en el orden correcto
 tr.appendChild(tdId);
 tr.appendChild(tdPaquete);
 tr.appendChild(tdEstado);
 tr.appendChild(tdFecha);
 tr.appendChild(tdHora);
 tr.appendChild(tdAcciones);

 tbody.appendChild(tr);
 });
}

window.initHistorialTable = initHistorialTable;