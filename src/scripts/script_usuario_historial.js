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
// cargar historial de viajes
      fetch("../../data/logic/HistorialLogic.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente: usuario.id_cliente })
      })
        .then(r => r.json())
        .then(data => {
          if (!data.correcto) {
            console.error("Error:", data.mensaje);
            return;
          }

          // Cargar tabla de historial de viajes 
          const scriptTabla = document.createElement("script");
          scriptTabla.src = "./../../scripts/historial_table.js";

          scriptTabla.onload = () => {
            if (typeof window.initHistorialTable === "function") {
              window.initHistorialTable(data.viajes);
            } else {
              console.error("No se encontró initHistorialTable");
            }
          };

          document.body.appendChild(scriptTabla);

        })
        .catch(err => {
          console.error("Error cargando historial:", err);
        });

      
// cargar historial de reservaciones
fetch("../../data/logic/ReservacionLogic.php", {
 method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente: usuario.id_cliente })
      })
        .then(r => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.json();
        })
        .then(data => {
          console.log("Respuesta completa de reservaciones:", data); // Debug
          
          if (!data.correcto) {
            console.error("Error del servidor:", data.mensaje);
            const tbody = document.querySelector("#reservaciones-table-sample tbody");
            if (tbody) {
              tbody.innerHTML = "<tr><td colspan='7' style='text-align: center; color: red;'>Error: " + (data.mensaje || "Error desconocido") + "</td></tr>";
            }
            return;
          }

          // Validar que existan reservaciones
          if (!data.reservaciones) {
            console.warn("No se recibió la propiedad 'reservaciones' en la respuesta");
            const tbody = document.querySelector("#reservaciones-table-sample tbody");
            if (tbody) {
              tbody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>No se recibieron datos de reservaciones</td></tr>";
            }
            return;
          }

          if (!Array.isArray(data.reservaciones)) {
            console.error("Las reservaciones no son un array:", typeof data.reservaciones, data.reservaciones);
            const tbody = document.querySelector("#reservaciones-table-sample tbody");
            if (tbody) {
              tbody.innerHTML = "<tr><td colspan='7' style='text-align: center; color: red;'>Error: Formato de datos incorrecto</td></tr>";
            }
            return;
          }

          console.log("Reservaciones recibidas:", data.reservaciones.length, "elementos");

          // Verificar si el script ya está cargado
          if (typeof window.initReservacionesTable === "function") {
            console.log("Función ya disponible, inicializando tabla directamente");
            window.initReservacionesTable(data.reservaciones);
          } else {
            // Cargar tabla de historial de reservaciones
            const scriptReservaciones = document.createElement("script");
            scriptReservaciones.src = "./../../scripts/reservations_table.js"; 

            scriptReservaciones.onload = () => {
              console.log("Script reservations_table.js cargado exitosamente");
              
              // Intentar múltiples veces en caso de que haya un pequeño delay
              let intentos = 0;
              const intentarInicializar = () => {
                intentos++;
                if (typeof window.initReservacionesTable === "function") {
                  console.log("Inicializando tabla con", data.reservaciones.length, "reservaciones");
                  window.initReservacionesTable(data.reservaciones);
                } else if (intentos < 10) {
                  console.log("Esperando función... intento", intentos);
                  setTimeout(intentarInicializar, 50);
                } else {
                  console.error("No se pudo encontrar initReservacionesTable después de", intentos, "intentos");
                  const tbody = document.querySelector("#reservaciones-table-sample tbody");
                  if (tbody) {
                    tbody.innerHTML = "<tr><td colspan='7' style='text-align: center; color: red;'>Error: No se pudo cargar la función de inicialización</td></tr>";
                  }
                }
              };
              
              setTimeout(intentarInicializar, 50);
            };

            scriptReservaciones.onerror = (err) => {
              console.error("Error al cargar el script reservations_table.js:", err);
              const tbody = document.querySelector("#reservaciones-table-sample tbody");
              if (tbody) {
                tbody.innerHTML = "<tr><td colspan='7' style='text-align: center; color: red;'>Error al cargar el script de la tabla</td></tr>";
              }
            };

            document.body.appendChild(scriptReservaciones);
          }

        })
        .catch(err => {
          console.error("Error cargando historial de reservaciones:", err);
          const tbody = document.querySelector("#reservaciones-table-sample tbody");
          if (tbody) {
            tbody.innerHTML = "<tr><td colspan='7' style='text-align: center; color: red;'>Error de conexión: " + err.message + "</td></tr>";
          }
        });



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