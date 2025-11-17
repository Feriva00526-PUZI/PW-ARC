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

  // 1. ID (nuevo: item.id_viaje o item.id_paquete, según lo que quieras mostrar)
    // Usaremos el ID de viaje si existe, o el de paquete como segunda opción
  const tdId = document.createElement("td");  tdId.textContent = item.id_viaje || item.id_paquete; 

  // 2. Paquete
  const tdPaquete = document.createElement("td");
  tdPaquete.textContent = item.nombre_paquete + " - " + item.nombre_lugar;

  // 3. Estado
 const tdEstado = document.createElement("td");
const divEstado = document.createElement("div");
 divEstado.textContent = item.estado;
 divEstado.className = getStatusClass(item.estado);
 tdEstado.appendChild(divEstado);

 // 4. Fecha
 const tdFecha = document.createElement("td");
 tdFecha.textContent = item.fecha_viaje;

 // 5. Hora (nuevo)
 const tdHora = document.createElement("td");
 tdHora.textContent = item.hora_viaje;

 // 6. Acciones
 const tdAcciones = document.createElement("td");
const btnDescripcion = document.createElement("button");
 btnDescripcion.className = "hist-btn hist-btn-desc";
btnDescripcion.textContent = "Descripción";

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
 tr.appendChild(tdHora); // Aseguramos que la hora vaya antes de Acciones
tr.appendChild(tdAcciones);

 tbody.appendChild(tr);
 });
}

window.initHistorialTable = initHistorialTable;