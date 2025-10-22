/*
  Historial simple: exporta window.initHistorialTable(data)
  - data: array opcional de objetos { id, destino, status, fecha, detalle }
  - si no se pasa data se usa un conjunto de ejemplo (3 filas)
  - si existe un bloque HTML con id="hist-table-sample" llenará su tbody en lugar de crear un nuevo contenedor
*/
(function () {
  function defaultData() {
    return [
      { id: 1, destino: "Cusco, Perú", status: "En espera", fecha: "2025-11-10", detalle: { costo: "$450", eventos: "Machu Picchu, City tour", aerolinea: "AeroAndes", hotel: "Inti Plaza" } },
      { id: 2, destino: "Cartagena, Colombia", status: "Cancelado", fecha: "2025-06-21", detalle: { costo: "$320", eventos: "Tour Ciudad Amurallada", aerolinea: "ColoAir", hotel: "Bocagrande Inn" } },
      { id: 3, destino: "Bariloche, Argentina", status: "Realizado", fecha: "2024-12-05", detalle: { costo: "$620", eventos: "Circuito chico, Catamarán", aerolinea: "PatagoniaFly", hotel: "Lakeside Resort" } }
    ];
  }

  // Añade estilos sencillos si no existen
  function ensureStyles() {
    if (document.getElementById("historial-styles")) return;
    var css = '\
    .hist-table-container { margin: 18px 0; overflow-x: auto; }\
    .hist-table { width:100%; border-collapse: collapse; min-width:640px; }\
    .hist-table th, .hist-table td { padding:8px 10px; border-bottom:1px solid rgba(0,0,0,0.06); text-align:left; }\
    .hist-table th { background:#023E8A; color:#fff; }\
    .status-en-espera { color: #2b1a00; font-weight:700; }\
    .status-cancelado { color: #d00000; font-weight:700; }\
    .status-realizado { color: #00a86b; font-weight:700; }\
    .hist-btn { padding:6px 10px; margin-right:6px; border-radius:6px; border:none; cursor:pointer; color:#fff; }\
    .hist-cancel { background:#d00000; }\
    .hist-desc { background:#023E8A; }\
    @media (max-width:700px){ .hist-table{ min-width:520px; } }';
    var style = document.createElement("style");
    style.id = "historial-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function clsFor(status) {
    if (!status) return "";
    var s = status.toLowerCase();
    if (s.indexOf("espera") !== -1) return "status-en-espera";
    if (s.indexOf("cancel") !== -1) return "status-cancelado";
    return "status-realizado";
  }

  function makeRow(item) {
    var tr = document.createElement("tr");

    var tdDestino = document.createElement("td");
    tdDestino.textContent = item.destino || "-";

    var tdStatus = document.createElement("td");
    // Usar badge/span para estilos si tus CSS lo espera
    var span = document.createElement("span");
    span.textContent = item.status || "-";
    span.className = clsFor(item.status);
    tdStatus.appendChild(span);

    var tdFecha = document.createElement("td");
    tdFecha.textContent = item.fecha || "-";

    var tdAcc = document.createElement("td");

    // Botón de descripción (muestra alert simple)
    var btnDesc = document.createElement("button");
    btnDesc.className = "hist-btn hist-desc";
    btnDesc.textContent = "Descripción";
    btnDesc.addEventListener("click", function () {
      var d = item.detalle || {};
      var txt = "Destino: " + (item.destino || "-") + "\n" +
                "Costo: " + (d.costo || "-") + "\n" +
                "Eventos: " + (d.eventos || "-") + "\n" +
                "Aerolínea: " + (d.aerolinea || "-") + "\n" +
                "Hotel: " + (d.hotel || "-") + "\n" +
                "Estado: " + (item.status || "-") + "\n" +
                "Fecha: " + (item.fecha || "-");
      alert(txt);
    });

    tdAcc.appendChild(btnDesc);

    // Si está en espera mostrar botón cancelar
    if ((item.status || "").toLowerCase().indexOf("espera") !== -1) {
      var btnCancel = document.createElement("button");
      btnCancel.className = "hist-btn hist-cancel";
      btnCancel.textContent = "Cancelar";
      btnCancel.addEventListener("click", function () {
        item.status = "Cancelado";
        // actualizar la celda de estado
        span.textContent = item.status;
        span.className = clsFor(item.status);
        btnCancel.disabled = true;
      });
      tdAcc.insertBefore(btnCancel, btnDesc);
    }

    tr.appendChild(tdDestino);
    tr.appendChild(tdStatus);
    tr.appendChild(tdFecha);
    tr.appendChild(tdAcc);
    return tr;
  }

  // Función pública
  function initHistorialTable(data) {
    ensureStyles();

    if (!Array.isArray(data) || data.length === 0) {
      data = defaultData();
    }

    // Si existe una estructura ya en HTML con id="hist-table-sample", rellenar su tbody
    var sample = document.getElementById("hist-table-sample");
    if (sample) {
      var tbody = sample.querySelector("tbody");
      if (!tbody) {
        // CORRECCIÓN: usar comillas correctamente y comprobación segura de la tabla
        tbody = document.createElement("tbody");
        var tableInSample = sample.querySelector("table");
        if (tableInSample) {
          tableInSample.appendChild(tbody);
        } else {
          // Si no hay tabla dentro del sample, crearla (estructura mínima)
          var tableFallback = document.createElement("table");
          tableFallback.className = "hist-table";
          // crear thead básico para accesibilidad
          var theadFallback = document.createElement("thead");
          theadFallback.innerHTML = "<tr><th>Destino</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>";
          tableFallback.appendChild(theadFallback);
          tableFallback.appendChild(tbody);
          // Insertar la tabla fallback dentro del sample
          sample.appendChild(tableFallback);
        }
      }
      // Limpiar
      tbody.innerHTML = "";
      data.forEach(function(item) { tbody.appendChild(makeRow(item)); });
      return;
    }

    // Si no existe muestra insertarla en main.box o main
    var mainBox = document.querySelector("main.box") || document.querySelector("main");
    if (!mainBox) {
      console.warn("historial_table: no se encontró <main> o main.box para insertar la tabla.");
      return;
    }

    // construir contenedor y tabla
    var container = document.createElement("div");
    container.className = "hist-table-container box";

    var title = document.createElement("h2");
    title.textContent = "Historial de Reservas";
    title.style.marginBottom = "10px";
    container.appendChild(title);

    var tblWrap = document.createElement("div");
    tblWrap.className = "table-wrap";
    tblWrap.style.overflowX = "auto";

    var table = document.createElement("table");
    table.className = "hist-table";
    table.setAttribute("role", "table");

    var thead = document.createElement("thead");
    thead.innerHTML = "<tr><th>Destino</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    data.forEach(function (item) {
      tbody.appendChild(makeRow(item));
    });

    table.appendChild(tbody);
    tblWrap.appendChild(table);
    container.appendChild(tblWrap);
    mainBox.appendChild(container);
  }

  // Exponer la función con dos nombres por compatibilidad
  window.initHistorialTable = initHistorialTable;
  window.renderHistorialTable = initHistorialTable;
})();
