/*
  historial_table.js (versión simple)
  Crea las filas de la tabla y maneja los botones de Cancelar y Descripción.
*/

function getStatusClass(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("program") || s.includes("espera")) return "status-en-espera badge";
  if (s.includes("curso")) return "status-en-curso badge";
  if (s.includes("cancel")) return "status-cancelado badge";
  if (s.includes("final") || s.includes("realiz")) return "status-realizado badge";
  return "status-realizado badge";
}

function initHistorialTable(datos) {
  const tbody = document.querySelector("#hist-table-sample tbody");
  if (!tbody) return;

  tbody.innerHTML = ""; // limpia la tabla

  datos.forEach((item) => {
    const fila = document.createElement("tr");

    //Destino
    const tdDestino = document.createElement("td");
    tdDestino.textContent = item.destino || "-";
    fila.appendChild(tdDestino);

    //Estado
    const tdEstado = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = item.status || "-";
    span.className = getStatusClass(item.status);
    tdEstado.appendChild(span);
    fila.appendChild(tdEstado);

    //Fecha
    const tdFecha = document.createElement("td");
    tdFecha.textContent = item.fecha || "-";
    fila.appendChild(tdFecha);

    // Acciones
    const tdAcciones = document.createElement("td");

    const btnCancelar = document.createElement("button");
    btnCancelar.className = "hist-btn hist-btn-cancel";
    btnCancelar.textContent = "Cancelar";

    const btnDescripcion = document.createElement("button");
    btnDescripcion.className = "hist-btn hist-btn-desc";
    btnDescripcion.textContent = "Descripción";

    // Si el viaje ya está cancelado o finalizado, no se puede cancelar
    const estado = (item.status || "").toLowerCase();
    if (estado.includes("cancel") || estado.includes("final") || estado.includes("realiz")) {
      btnCancelar.disabled = true;
      btnCancelar.classList.add("disabled-btn");
    }

    //Eventos de los botones
    // Evento Cancelar
    btnCancelar.addEventListener("click", () => {
      item.status = "Cancelado";
      span.textContent = "Cancelado";
      span.className = getStatusClass(item.status);
      btnCancelar.disabled = true;
      btnCancelar.classList.add("disabled-btn");
      alert(`El viaje a ${item.destino} fue cancelado.`);
    });

    // Evento Descripción 
    btnDescripcion.addEventListener("click", () => {
      const detalle = item.detalle || {};
      alert(
        `Lugar: ${detalle.lugarNombre || "-"}\n` +
        `Estado: ${item.status || "-"}\n` +
        `Fecha: ${item.fecha || "-"}\n` +
        `Agencia: ${detalle.agenciaNombre || "-"}\n` +
        `Evento: ${detalle.eventoNombre || "-"}`
      );
    });

    tdAcciones.appendChild(btnCancelar);
    tdAcciones.appendChild(btnDescripcion);
    fila.appendChild(tdAcciones);

    tbody.appendChild(fila);
  });
}

// Deja la funcion disponible globalmente
window.initHistorialTable = initHistorialTable;
