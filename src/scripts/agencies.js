

let agencia = JSON.parse(sessionStorage.getItem("agencia_logeado"));

window.addEventListener("load", function () {

    console.log(agencia)
    const idAgencia = agencia.id_agencia;

    if (!agencia) {
        window.location.href = "../../../index.html";
    }


    console.log(agencia.imagen_url);
    // Configuracion inicial
    document.title = agencia.nombre_agencia;

    document.getElementById("imgAgencia").src =
        `../../../src/media/images/agencias/${agencia.imagen_url}`;


    // Obtener número paquetes
    fetch(`../../data/Logic/agencyController.php?accion=numeroPaquetes&id_agencia=${idAgencia}`)
        .then(res => res.json())
        .then(json => {
            if (json.correcto) {
                document.getElementById("numeroPaquetes")
                    .innerText = `Numero de paquetes: ${json.total}`;
            } else {
                console.error(json.mensaje);
            }
        });

    // Cargar paquetes
    let paquetes = [];
    fetch(`../../data/Logic/agencyController.php?accion=paquetes&id_agencia=${idAgencia}`)
        .then(res => res.json())
        .then(json => {
            if (json.correcto) {
                paquetes = json.data;
                filtrarPaquetes();
            } else {
                console.error(json.mensaje);
            }
        });

    // Variables
    let asc = true;

    const tbody = document.getElementById("paquetesBody");
    const buscarNombre = document.getElementById("buscarNombre");
    const buscarLugar = document.getElementById("buscarLugar");
    const btnOrdenar = document.getElementById("btnOrdenar");
    const btnAgregar = document.getElementById("btnAgregar");

    function renderTabla(lista) {
        tbody.innerHTML = "";
        lista.forEach(pkg => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Nombre">${pkg.nombre_paquete}</td>
                <td data-label="Lugar">${pkg.lugar || "N/A"}</td>
                <td data-label="Precio">$${pkg.precio}</td>
                <td data-label="Acciones">
                    <button class="btn-modificar" data-id="${pkg.id_paquete}">Modificar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


    // Filtrar 
    function filtrarPaquetes() {
        let filtrados = [...paquetes];

        const nombre = buscarNombre.value.toLowerCase();
        const lugar = buscarLugar.value.toLowerCase();

        filtrados = filtrados.filter(p => {
            const matchNombre = p.nombre_paquete.toLowerCase().includes(nombre);
            const matchLugar = (p.lugar || "").toLowerCase().includes(lugar);

            return matchNombre && matchLugar;
        });

        // Ordenar por precio
        filtrados.sort((a, b) =>
            asc
                ? parseFloat(a.precio) - parseFloat(b.precio)
                : parseFloat(b.precio) - parseFloat(a.precio)
        );

        renderTabla(filtrados);
    }

    // Eventos input
    [buscarNombre, buscarLugar].forEach(input => {
        input.addEventListener("input", filtrarPaquetes);
    });

    // Ordenar
    btnOrdenar.addEventListener("click", () => {
        asc = !asc;
        filtrarPaquetes();
    });

    // Botones de la tabla
    tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-modificar")) {
            this.sessionStorage.setItem("paquete_seleccionado", e.target.dataset.id);
            window.location.href = "packages.html";
        }
    });

    btnAgregar.addEventListener("click", function () {
        window.location.href = "./add_packages.html";
    });

    // Crear el footer y el header
    footer_header();

    function footer_header() {

        fetch("./../../../src/components/header.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data);

                const script = document.createElement("script");
                script.src = "./../../../src/scripts/header_script.js";
                document.body.appendChild(script);

                /*HEADER DINAMICO */
                /*Cambio de la imagen del header */
                const s_header = document.getElementById("s_header");
                s_header.style.backgroundImage = "url(./../../../src/media/images/layout/img_background_header.jpg)";

                /*Cambiar el titulo del header */
                document.getElementById("n_h2").innerText = agencia.nombre_agencia;
                document.getElementById("s_icon").setAttribute("src", "./../../../src/media/images/icons/icon_arc.png");
                const bnav = document.getElementById("underline_nav");

                /*Agregar los elementos al nav */

                /*Primero*/
                const a1 = document.createElement("a");
                a1.id = "a1";
                a1.href = "#";
                const ai1 = document.createElement("img");
                ai1.src = "./../../../src/media/images/icons/icon_home.png";
                ai1.classList.add("icon_nav");
                a1.appendChild(ai1);
                a1.append("Pagina Principal");
                bnav.appendChild(a1);

                /*Tercero*/
                const a3 = document.createElement("a");
                a3.id = "a3";
                a3.href = "./add_packages.html";
                const ai3 = document.createElement("img");
                ai3.src = "./../../../src/media/images/icons/icon_travel.png";
                ai3.classList.add("icon_nav");
                a3.appendChild(ai3);
                a3.append("Crear paquete");
                bnav.appendChild(a3);

                /*Boton de registro o iniciar sesion*/
                const btn_is_r = document.createElement("button");
                btn_is_r.id = "btn_is_r";
                const btn_a = document.createElement("a");
                const icon_user = document.createElement("img");
                icon_user.src = "./../../../src/media/images/icons/icon_user.png";
                icon_user.classList.add("icon_user");
                btn_a.appendChild(icon_user);
                btn_is_r.appendChild(btn_a);
                bnav.appendChild(btn_is_r);


            });

        fetch("./../../../src/components/footer.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("beforeend", data);

                document.getElementById("f_icon").src =
                    "./../../../src/media/images/icons/icon_arc.png";

                document.querySelector(".f_link").href = "#";

                const f_general = document.getElementById("f_general");
                f_general.style.backgroundImage =
                    "url(./../../../src/media/images/layout/imgLayout20.jpg)";
                f_general.style.backgroundPosition = "50% 80%";
            });

        function img(src) {
            const i = document.createElement("img");
            i.src = src;
            i.classList.add("icon_nav");
            return i;
        }
    }
});
