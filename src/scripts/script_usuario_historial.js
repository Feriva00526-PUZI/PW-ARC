window.addEventListener("load", function () {
  const usuarioSession = sessionStorage.getItem("usuario_logeado");
  if (usuarioSession == null) {
    window.location.href = "./../../../index.html";
    return;
  }
  let usuario = JSON.parse(usuarioSession);
  fetch("./../../components/header.html")
    .then(r => r.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);

      // Cargar script del header
      const scriptHeader = document.createElement("script");
      scriptHeader.src = "./../../scripts/header_script.js";
      document.body.appendChild(scriptHeader);

      // Ajustes visuales del header
      const s_header = document.getElementById("s_header");
      if (s_header)
        s_header.style.backgroundImage = "url(./../../media/images/layout/background-img-historial.jpeg)";

      const n_h2 = document.getElementById("n_h2");
      if (n_h2) n_h2.innerText = "HISTORIAL USUARIO";

      const s_icon = document.getElementById("s_icon");
      if (s_icon) s_icon.src = "./../../media/images/icons/icon_arc.png";

      // Configurar navegacion del header
      const nav = document.getElementById("underline_nav");
      if (nav) {
        const crearNavItem = (id, img, texto, redirect) => {
          const a = document.createElement("a");
          a.id = id;
          a.href = redirect;

          const icono = document.createElement("img");
          icono.src = img;
          icono.classList.add("icon_nav");

          a.appendChild(icono);
          a.append(" " + texto);
          return a;
        };

        nav.appendChild(crearNavItem(
          "a1",
          "./../../media/images/icons/icon_home.png",
          "Pagina Principal",
          "./usuario_principal.html"
        ));

        nav.appendChild(crearNavItem(
          "a2",
          "./../../media/images/icons/icon_home.png",
          "Paquetes de viaje",
          "./usuarioviajes.html"
        ));

        nav.appendChild(crearNavItem(
          "a3",
          "./../../media/images/icons/icon_home.png",
          "Actividades",
          "./usuarioEventos.html"
        ));

        nav.appendChild(crearNavItem(
          "a4",
          "./../../media/images/icons/icon_home.png",
          "Historial",
          "./usuario_historial.html"
        ));

        const btnUsuario = document.createElement("button");
        btnUsuario.id = "btn_is_r";

        const aUser = document.createElement("a");
        aUser.href = "#";
        aUser.target = "_blank";

        const iconUser = document.createElement("img");
        iconUser.src = "./../../media/images/icons/icon_user.png";
        iconUser.classList.add("icon_user");

        aUser.appendChild(iconUser);
        btnUsuario.appendChild(aUser);
        nav.appendChild(btnUsuario);
      }

      // Cargar script de filtros primero
      const scriptFiltros = document.createElement("script");
      scriptFiltros.src = "./../../scripts/comboBoxHistorial.js";
      
      scriptFiltros.onload = () => {
        // Cargar ambos historiales en paralelo
        Promise.all([
          fetch("../../data/logic/HistorialLogic.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cliente: usuario.id_cliente })
          }).then(r => r.json()),
          fetch("../../data/logic/ReservacionLogic.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cliente: usuario.id_cliente })
          }).then(r => r.json())
        ]).then(([dataViajes, dataReservaciones]) => {
          // Verificar respuestas
          if (!dataViajes.correcto) {
            console.error("Error cargando viajes:", dataViajes.mensaje);
            return;
          }
          if (!dataReservaciones.correcto) {
            console.error("Error cargando reservaciones:", dataReservaciones.mensaje);
            return;
          }

          // Inicializar datos en el módulo de filtros
          if (typeof window.inicializarDatosHistorial === "function") {
            window.inicializarDatosHistorial(dataViajes.viajes || [], dataReservaciones.reservaciones || []);
          }

          // Cargar scripts de tablas
          const scriptTabla = document.createElement("script");
          scriptTabla.src = "./../../scripts/historial_table.js";

          scriptTabla.onload = () => {
            const scriptReservaciones = document.createElement("script");
            scriptReservaciones.src = "./../../scripts/reservations_table.js";

            scriptReservaciones.onload = () => {
              // Inicializar filtros después de que todo esté cargado
              if (typeof window.inicializarFiltrosHistorial === "function") {
                window.inicializarFiltrosHistorial();
              }

              // Renderizar tablas iniciales con todos los datos
              if (typeof window.initHistorialTable === "function") {
                window.initHistorialTable(dataViajes.viajes || []);
              }
              if (typeof window.initReservacionesTable === "function") {
                window.initReservacionesTable(dataReservaciones.reservaciones || []);
              }
            };

            document.body.appendChild(scriptReservaciones);
          };

          document.body.appendChild(scriptTabla);
        }).catch(err => {
          console.error("Error cargando historiales:", err);
        });
      };

      document.body.appendChild(scriptFiltros);

    })
    .catch(err => {
      console.error("Error cargando header.html:", err);
    });


  // Cargar dinamicamente el footer
  fetch("./../../components/footer.html")
    .then(r => r.text())
    .then(html => {
      document.body.insertAdjacentHTML("beforeend", html);

      const f_icon = document.getElementById("f_icon");
      if (f_icon) f_icon.src = "./../../media/images/icons/icon_arc.png";

      const linkAbout = document.querySelector(".f_link");
      if (linkAbout) linkAbout.href = "#";

      const f_general = document.getElementById("f_general");
      if (f_general) {
        f_general.style.backgroundImage = "url(./../../media/images/layout/imgLayout20.jpg)";
        f_general.style.backgroundPosition = "50% 80%";
      }
    })
    .catch(err => {
      console.error("Error cargando footer.html:", err);
    });
});
