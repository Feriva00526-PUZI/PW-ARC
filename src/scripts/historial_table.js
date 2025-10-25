/*
  historial_table.js 
  Genera las filas de la tabla #hist-table-sample tbody dinámicamente
*/
(function () {
  function getStatusClass(status) {
    const s = status?.toLowerCase() || "";
    if (s.includes("espera")) return "status-en-espera badge";
    if (s.includes("cancel")) return "status-cancelado badge";
    return "status-realizado badge";
  }

  function initHistorialTable(data = []) {
    const tbody = document.querySelector("#hist-table-sample tbody");
    if (!tbody) return console.error("No se encontró #hist-table-sample tbody.");

    tbody.innerHTML = "";

    data.forEach(item => {
      const tr = document.createElement("tr");

      // --- DESTINO ---
      const tdDestino = document.createElement("td");
      tdDestino.textContent = item.destino;
      tr.appendChild(tdDestino);

      // --- ESTADO ---
      const tdStatus = document.createElement("td");
      const span = document.createElement("span");
      span.textContent = item.status;
      span.className = getStatusClass(item.status);
      tdStatus.appendChild(span);
      tr.appendChild(tdStatus);

      // --- FECHA ---
      const tdFecha = document.createElement("td");
      tdFecha.textContent = item.fecha;
      tr.appendChild(tdFecha);

      // --- ACCIONES ---
      const tdAcc = document.createElement("td");
      tdAcc.style.textAlign = "left"; 

      // Crear botones
      const btnCancel = document.createElement("button");
      btnCancel.className = "hist-btn hist-btn-cancel";
      btnCancel.textContent = "Cancelar";

      const btnDesc = document.createElement("button");
      btnDesc.className = "hist-btn hist-btn-desc";
      btnDesc.textContent = "Descripción";

      const estado = item.status.toLowerCase();

      // Si el viaje ya está cancelado o realizado se deshabilita solo el boton cancelar
      if (estado.includes("cancel") || estado.includes("realizado")) {
        btnCancel.disabled = true;
        btnCancel.classList.add("disabled-btn");
      }

      // Evento boton "Cancelar"
      btnCancel.addEventListener("click", () => {
        if (btnCancel.disabled) return;

        item.status = "Cancelado";
        span.textContent = "Cancelado";
        span.className = getStatusClass(item.status);

        // Deshabilitar el boton de cancelar
        btnCancel.disabled = true;
        btnCancel.classList.add("disabled-btn");
      });

      // Evento boton "Descripcion"
      btnDesc.addEventListener("click", () => {
        const d = item.detalle || {};
        alert(
          `Destino: ${item.destino}\n` +
          `Costo: ${d.costo || "-"}\n` +
          `Eventos: ${d.eventos || "-"}\n` +
          `Aerolínea: ${d.aerolinea || "-"}\n` +
          `Hotel: ${d.hotel || "-"}\n` +
          `Estado: ${item.status}\n` +
          `Fecha: ${item.fecha}`
        );
      });

      // Agregar botones a la celda de acciones
      tdAcc.appendChild(btnCancel);
      tdAcc.appendChild(btnDesc);

      tr.appendChild(tdAcc);
      tbody.appendChild(tr);
    });
  }

  window.initHistorialTable = initHistorialTable;
})();