function getStatusClass(status) {
  const s = (status || "").toLowerCase();

  if (s === "pendiente") return "status-en-espera badge";
  if (s === "cancelado") return "status-cancelado badge";
  if (s === "completado") return "status-realizado badge";

  return "status-en-espera badge";
}

function initReservacionesTable(data) {
  console.log("initReservacionesTable - datos recibidos:", data);
  const tbody = document.querySelector("#reservaciones-table-sample tbody");
  if (!tbody) {
    console.error("No se encontró tbody para reservaciones");
    return;
  }
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    console.log("No hay datos de reservaciones");
    return;
  }

  data.forEach(item => {
    const tr = document.createElement("tr");
    const estadoReservacion = (item.estado_reservacion || "").toLowerCase();

    // id de la reservación
    const tdId = document.createElement("td");
    tdId.textContent = item.id_reservacion;

    // Evento y Lugar
    const tdEvento = document.createElement("td");
    tdEvento.textContent = item.nombre_evento + " en " + item.nombre_lugar;

    // Estado
    const tdEstado = document.createElement("td");
    const divEstado = document.createElement("div");
    divEstado.textContent = item.estado_reservacion;
    divEstado.className = getStatusClass(item.estado_reservacion);
    tdEstado.appendChild(divEstado);

    // Fecha del Evento
    const tdFecha = document.createElement("td");
    tdFecha.textContent = item.fecha_evento;

    // Hora del Evento
    const tdHora = document.createElement("td");
    tdHora.textContent = item.hora_evento;
    
    // Precio del Boleto
    const tdPrecio = document.createElement("td");
    tdPrecio.textContent = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.precio_boleto); 

    // Acciones
    const tdAcciones = document.createElement("td");
    
    // Boton de descripcion
    const btnDescripcion = document.createElement("button");
    btnDescripcion.className = "hist-btn hist-btn-desc";
    btnDescripcion.textContent = "Descripción";
    
    // Botón Cancelar
    const btnCancelar = document.createElement("button");
    btnCancelar.className = "hist-btn hist-btn-cancel";
    btnCancelar.textContent = "Cancelar";
    
    // Deshabilitar si no está pendiente y aplicar estilo CSS de deshabilitado
    if (estadoReservacion !== "pendiente") {
        btnCancelar.disabled = true;
        btnCancelar.classList.add("disabled-btn");
        btnCancelar.textContent = estadoReservacion === "cancelado" ? "Cancelado" : "Realizado";
    }

    btnDescripcion.addEventListener("click", () => {
      alert(
        "Evento: " + item.nombre_evento + "\n" +
        "Lugar: " + item.nombre_lugar + ", " + item.ciudad + "\n" +
        "Tipo de Actividad: " + item.tipo_actividad + "\n" +
        "Organizador: " + item.nombre_organizadora + "\n" +
        "Descripción: " + item.descripcion + "\n\n" +
        "Costo: " + tdPrecio.textContent + "\n" +
        "Fecha/Hora: " + item.fecha_evento + " a las " + item.hora_evento + "\n" +
        "Estado de la Reserva: " + item.estado_reservacion
      );
    });
    
    
    if (estadoReservacion === "pendiente") {
        btnCancelar.addEventListener("click", () => {

            if (!confirm("¿Seguro que deseas cancelar esta reservación?")) return;

            fetch("../../data/logic/ReservacionLogic.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accion: "cancelar_reservacion",
                    id_reservacion: item.id_reservacion
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.correcto) {
                    alert("La reservación ha sido cancelada correctamente.");
                    
                    item.estado_reservacion = "cancelado";
                    divEstado.textContent = "cancelado";
                    divEstado.className = getStatusClass("cancelado");
                    btnCancelar.disabled = true;
                    btnCancelar.classList.add("disabled-btn");
                    btnCancelar.textContent = "Cancelado";
                    btnCancelar.removeEventListener("click", this);
                } else {
                    alert("Error: " + data.mensaje);
                }
            })
            .catch(err => console.error("Error en fetch:", err));
        });
    }


    tdAcciones.appendChild(btnDescripcion);
    tdAcciones.appendChild(btnCancelar);

    tr.appendChild(tdId);
    tr.appendChild(tdEvento);
    tr.appendChild(tdEstado);
    tr.appendChild(tdFecha);
    tr.appendChild(tdHora);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
    
}

window.initReservacionesTable = initReservacionesTable;
