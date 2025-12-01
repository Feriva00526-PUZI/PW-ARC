import { crearCarrusel } from "./carruselUP.js";
window.addEventListener("load", function () {
    const usuarioSession = sessionStorage.getItem("usuario_logeado");
    if (usuarioSession == null) {
        window.location.href = "./../../../index.html";
        return;
    }
    fetch("./../../components/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            const script = document.createElement("script");
            script.src = "./../../scripts/header_script.js";
            document.body.appendChild(script);

            /*HEADER DINAMICO */
            /*Cambio de la imagen del header */
            const s_header = document.getElementById("s_header");
            s_header.style.backgroundImage = "url(./../../media/images/layout/img_background_header.jpg)";

            /*Cambiar el titulo del header */
            document.getElementById("n_h2").innerText = "PAGINA PRINC";
            document.getElementById("s_icon").setAttribute("src", "./../../media/images/icons/icon_arc.png");
            const bnav = document.getElementById("underline_nav");

            /*Agregar los elementos al nav */
            /*Primero*/
            const a1 = document.createElement("a");
            a1.id = "a1";
            a1.href = "./usuario_principal.html";
            const ai1 = document.createElement("img");
            ai1.src = "./../../media/images/icons/icon_home.png";
            ai1.classList.add("icon_nav");
            a1.appendChild(ai1);
            a1.append("Pagina Principal");
            bnav.appendChild(a1);
            /*Segundo*/
            const a2 = document.createElement("a");
            a2.id = "a2";
            a2.href = "./usuarioviajes.html";
            const ai2 = document.createElement("img");
            ai2.src = "./../../media/images/icons/icon_travel.png";
            ai2.classList.add("icon_nav");
            a2.appendChild(ai2);
            a2.append("Paquetes de viaje");
            bnav.appendChild(a2);
            /*Tercero*/
            const a3 = document.createElement("a");
            a3.id = "a3";
            a3.href = "./usuarioEventos.html";
            const ai3 = document.createElement("img");
            ai3.src = "./../../media/images/icons/icon_event.png";
            ai3.classList.add("icon_nav");
            a3.appendChild(ai3);
            a3.append("Actividades");
            bnav.appendChild(a3);
            /*Cuarto*/
            const a4 = document.createElement("a");
            a4.id = "a4";
            a4.href = "./usuario_historial.html";
            const ai4 = document.createElement("img");
            ai4.src = "./../../media/images/icons/icon_event.png";
            ai4.classList.add("icon_nav");
            a4.appendChild(ai4);
            a4.append("Historial");
            bnav.appendChild(a4);
            /*Boton de registro o iniciar sesion*/
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


    // Cargar lugares más populares desde la base de datos
    fetch("./../../data/Logic/CarruselLogic.php")
        .then(response => response.json())
        .then(data => {
            if (data.correcto && data.lugares && data.lugares.length > 0) {
                // Convertir los lugares al formato que espera el carrusel
                const lugaresFormateados = data.lugares.map(lugar => ({
                    nombre_paquete: lugar.nombre_lugar,
                    descripcion_paquete: lugar.descripcion || "Lugar destacado",
                    imagen_url: lugar.imagen_url
                }));

                // Crear el carrusel con los datos de la base de datos
                crearCarrusel({
                    containerSelector: "#carrusel-paquetes",
                    dataArray: lugaresFormateados,
                    type: "paquete",
                    title: "Lugares más populares"
                });
            } else {
                console.error("Error al cargar lugares populares:", data.mensaje || "No se encontraron lugares");
                // Fallback: mostrar mensaje o carrusel vacío
                document.getElementById("carrusel-paquetes").innerHTML =
                    "<p style='text-align: center; padding: 20px;'>No hay lugares populares disponibles en este momento.</p>";
            }
        })
        .catch(error => {
            console.error("Error al cargar el carrusel:", error);
            document.getElementById("carrusel-paquetes").innerHTML =
                "<p style='text-align: center; padding: 20px;'>Error al cargar los lugares populares.</p>";
        });
});
