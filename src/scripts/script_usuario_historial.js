window.addEventListener("load", function () {
  fetch("./../../components/header.html")
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("afterbegin", data);

      const scriptHeader = document.createElement("script");
      scriptHeader.src = "./../../scripts/header_script.js";
      document.body.appendChild(scriptHeader);

      /* HEADER DINÁMICO */
      const s_header = document.getElementById("s_header");
      if (s_header) s_header.style.backgroundImage = "url(./../../media/images/layout/background-img-historial.jpeg)";

      const n_h2 = document.getElementById("n_h2");
      if (n_h2) n_h2.innerText = "HISTORIAL USUARIO";

      const s_icon = document.getElementById("s_icon");
      if (s_icon) s_icon.setAttribute("src", "./../../media/images/icons/icon_arc.png");

      const bnav = document.getElementById("underline_nav");
      if (bnav) {
        // limpiar nav si ya tiene cosas (opcional)
        // bnav.innerHTML = "";

        const makeNavItem = (id, img, text) => {
          const a = document.createElement("a");
          a.id = id;
          a.href = "#";
          const ai = document.createElement("img");
          ai.src = img;
          ai.classList.add("icon_nav");
          a.appendChild(ai);
          a.append(" " + text);
          return a;
        };

        bnav.appendChild(makeNavItem("a1", "./../../media/images/icons/icon_home.png", "Pagina Principal"));
        bnav.appendChild(makeNavItem("a2", "./../../media/images/icons/icon_travel.png", "Lugares Populares"));
        bnav.appendChild(makeNavItem("a3", "./../../media/images/icons/icon_event.png", "Eventos Recientes"));

        const btn_is_r = document.createElement("button");
        btn_is_r.id = "btn_is_r";
        const btn_a = document.createElement("a");
        btn_a.href = "#";
        btn_a.target = "_blank";
        const icon_user = document.createElement("img");
        icon_user.src = "./../../media/images/icons/icon_user.png";
        icon_user.classList.add("icon_user");
        btn_a.appendChild(icon_user);
        btn_is_r.appendChild(btn_a);
        bnav.appendChild(btn_is_r);
      }

      /* ==== CARGA Y EJECUCIÓN DE LA TABLA DINÁMICA (archivo externo) ==== */

      const historyData = [
        {
          id: 1,
          destino: "Cusco, Perú",
          status: "En espera",
          fecha: "2025-11-10",
          detalle: { costo: "$450", eventos: "Machu Picchu, City tour", aerolinea: "AeroAndes", hotel: "Inti Plaza" }
        },
        {
          id: 2,
          destino: "Cartagena, Colombia",
          status: "Cancelado",
          fecha: "2025-06-21",
          detalle: { costo: "$320", eventos: "Tour Ciudad Amurallada", aerolinea: "ColoAir", hotel: "Bocagrande Inn" }
        },
        {
          id: 3,
          destino: "Bariloche, Argentina",
          status: "Realizado",
          fecha: "2024-12-05",
          detalle: { costo: "$620", eventos: "Circuito chico, Catamarán", aerolinea: "PatagoniaFly", hotel: "Lakeside Resort" }
        }
      ];

      // Insertar el script que contiene la lógica de la tabla y llamarla cuando esté cargado
      const scriptTable = document.createElement("script");
      scriptTable.src = "./../../scripts/historial_table.js";
      scriptTable.onload = function () {
        if (typeof window.initHistorialTable === "function") {
          window.initHistorialTable(historyData);
        } else if (typeof window.renderHistorialTable === "function") {
          window.renderHistorialTable(historyData);
        } else {
          console.error("historial_table: no se encontró la función initHistorialTable o renderHistorialTable.");
        }
      };
      document.body.appendChild(scriptTable);
    })
    .catch(err => {
      console.error("Error cargando header.html:", err);
    });
});
