window.addEventListener("load", function () {
  // Cargar dinámicamente el header
  fetch("./../../components/header.html")
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("afterbegin", data);

      // Insertar script del header
      const scriptHeader = document.createElement("script");
      scriptHeader.src = "./../../scripts/header_script.js";
      document.body.appendChild(scriptHeader);

    
      const s_header = document.getElementById("s_header");
      if (s_header)
        s_header.style.backgroundImage = "url(./../../media/images/layout/background-img-historial.jpeg)";

      const n_h2 = document.getElementById("n_h2");
      if (n_h2) n_h2.innerText = "HISTORIAL USUARIO";

      const s_icon = document.getElementById("s_icon");
      if (s_icon) s_icon.setAttribute("src", "./../../media/images/icons/icon_arc.png");

      const bnav = document.getElementById("underline_nav");
      if (bnav) {
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

      // Cargar el historial

     Promise.all([
        fetch("./../../data/viajes.json").then(r => r.json()),
        fetch("./../../data/lugares.json").then(r => r.json()),
        fetch("./../../data/agencias.json").then(r => r.json()),
        fetch("./../../data/eventos.json").then(r => r.json())
      ])
        .then(([viajes, lugares, agencias, eventos]) => {
          // la informacion
          const historyData = viajes.map(v => {
            const lugar = lugares.find(l => l.id_lugar === v.id_paquete) || {};
            const agencia = agencias.find(a => a.id_agencia === v.id_cliente) || {};
            const evento = eventos.find(e => e.id_evento === v.id_paquete) || {};

         
            const nombreLugar = lugar.nombre_lugar || `Paquete ${v.id_paquete}`;
            const ciudad = lugar.ciudad ? ` (${lugar.ciudad})` : "";
            const destinoFinal = `${nombreLugar}${ciudad}`;

            return {
              destino: destinoFinal,
              status: v.estado || "Desconocido",
              fecha: `${v.fecha_viaje || ""} ${v.hora_viaje || ""}`.trim(),
              detalle: {
                lugarNombre: lugar.nombre_lugar || "-",
                lugarDescripcion: lugar.descripcion || "-",
                lugarDireccion: lugar.direccion || "-",
                agenciaNombre: agencia.nombre_agencia || "-",
                eventoNombre: evento.nombre_evento || "-"
              }
            };
          });

          // Cargar script de tabla y ejecutarlo
          const scriptTable = document.createElement("script");
          scriptTable.src = "./../../scripts/historial_table.js";
          scriptTable.onload = function () {
            if (typeof window.initHistorialTable === "function") {
              window.initHistorialTable(historyData);
            } else {
              // Manejo de error si la función no esta disponible
              console.error("Error: no se encontró initHistorialTable.");
            }
          };
          document.body.appendChild(scriptTable);
        })
        .catch(err => {
          console.error("Error cargando los JSON del historial:", err);
        });
        // Fin carga historial
    })
    .catch(err => {
      console.error("Error cargando header.html:", err);
    });
    
   /*Copiar y pegar eso para añadir el footer en la pagina que sea */
    fetch("./../../components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);

            /*Cambio del icono ARC (Solo para actualizar la ruta relativa) */
            document.getElementById("f_icon").setAttribute("src", "./../../media/images/icons/icon_arc.png");

            /*Cambio link del boton hacia la pagina About Us (Solo para actualizar la ruta relativa) */
            document.querySelector(".f_link").href = "#";

            /*Cambio de la imagen del footer derecho*/
            const f_general = document.getElementById("f_general");
            f_general.style.backgroundImage = "url(./../../media/images/layout/img_background_footer.jpeg)";
            f_general.style.backgroundImage = "url(./../../media/images/layout/imgLayout20.jpg)";
            /*Cambiar que parte de la imagen se ve, el primer 50 es horizontalmente(no cambiarlo) y el segundo es para la altura que se visualiza */
            f_general.style.backgroundPosition = "50% 80%";
        });

});


