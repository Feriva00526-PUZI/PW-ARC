

function getStatusClass(status) {
  const s = (status || "").toLowerCase();

  if (s.includes("program") || s.includes("espera")) return "status-en-espera badge";
  if (s.includes("curso")) return "status-en-curso badge";
  if (s.includes("cancel")) return "status-cancelado badge";
  if (s.includes("final") || s.includes("realiz")) return "status-realizado badge";

  return "status-realizado badge";
}

function initHistorialTable(data) {
  const tbody = document.querySelector("#hist-table-sample tbody");
  if (!tbody) return;

  // Limpia la tabla
  tbody.innerHTML = "";

  // Crea cada fila de la tabla
  data.forEach(item => {
    const tr = document.createElement("tr");

    // Destino
    const tdDestino = document.createElement("td");
    tdDestino.textContent = item.destino || "-";

    // Estado
    const tdEstado = document.createElement("td");
    const divEstado = document.createElement("div");
    divEstado.textContent = item.status || "-";
    divEstado.className = getStatusClass(item.status);
    tdEstado.appendChild(divEstado);

    // Fecha
    const tdFecha = document.createElement("td");
    tdFecha.textContent = item.fecha || "-";

    // Acciones
    const tdAcciones = document.createElement("td");

    const btnCancelar = document.createElement("button");
    btnCancelar.className = "hist-btn hist-btn-cancel";
    btnCancelar.textContent = "Cancelar";

    const btnDescripcion = document.createElement("button");
    btnDescripcion.className = "hist-btn hist-btn-desc";
    btnDescripcion.textContent = "Descripcion";

    // Revisa si ya no se puede cancelar
    const st = (item.status || "").toLowerCase();
    const noCancelable =
      st.includes("cancel") ||
      st.includes("final") ||
      st.includes("realiz");

    if (noCancelable) {
      btnCancelar.disabled = true;
      btnCancelar.classList.add("disabled-btn");
    }

    // Evento cancelar
    btnCancelar.addEventListener("click", () => {
      item.status = "Cancelado";
      divEstado.textContent = "Cancelado";
      divEstado.className = getStatusClass(item.status);
      btnCancelar.disabled = true;
      btnCancelar.classList.add("disabled-btn");
      alert("El viaje a " + item.destino + " fue cancelado.");
    });

    // Evento descripcion
    btnDescripcion.addEventListener("click", () => {
      const d = item.detalle || {};
      alert(
        "Lugar: " + (d.lugarNombre || "-") + "\n" +
        "Estado: " + (item.status || "-") + "\n" +
        "Fecha: " + (item.fecha || "-") + "\n" +
        "Agencia: " + (d.agenciaNombre || "-") + "\n" +
        "Evento: " + (d.eventoNombre || "-")
      );
    });

    // Agrega botones a la celda
    tdAcciones.appendChild(btnCancelar);
    tdAcciones.appendChild(btnDescripcion);

    // Agrega todas las celdas a la fila
    tr.appendChild(tdDestino);
    tr.appendChild(tdEstado);
    tr.appendChild(tdFecha);
    tr.appendChild(tdAcciones);

    // Agrega la fila a la tabla
    tbody.appendChild(tr);
  });
}

window.initHistorialTable = initHistorialTable;
