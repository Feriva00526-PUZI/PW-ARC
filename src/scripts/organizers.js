
let organizadora = JSON.parse(sessionStorage.getItem("organizador_logeado"));

window.addEventListener("load", function () {

    console.log(organizadora)
    const idOrg = organizadora.id_organizadora;

    if (!organizadora) {
        window.location.href = "../../../index.html";
    }


    console.log(organizadora.imagen_url);
    // Configuracion inicial
    document.title = organizadora.nombre_agencia;

    document.getElementById("imgAgencia").src =
        `../../../src/media/images/organizers/${organizadora.imagen_url}`;


    // Obtener número eventos mes
    fetch(`../../data/Logic/organizerController.php?accion=numeroEventosMes&id_organizadora=${idOrg}`)
        .then(res => res.json())
        .then(json => {
            if (json.correcto) {
                document.getElementById("numeroEventos")
                    .innerText = `Numero de eventos este mes: ${json.total}`;
            } else {
                console.error(json.mensaje);
            }
        });

    // Cargar eventos
    let eventos = [];
    fetch(`../../data/Logic/organizerController.php?accion=eventos&id_organizadora=${idOrg}`)
        .then(res => res.json())
        .then(json => {
            if (json.correcto) {
                eventos = json.data;
                filtrarEventos();
            } else {
                console.error(json.mensaje);
            }
        });

    // Variables
    let asc = true;

    const tbody = document.getElementById("eventosBody");
    const buscarNombre = document.getElementById("buscarNombre");
    const buscarLugar = document.getElementById("buscarLugar");
    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");
    const btnOrdenar = document.getElementById("btnOrdenar");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCalendar = document.getElementById("btnCalendar");

    function renderTabla(lista) {
        tbody.innerHTML = "";
        lista.forEach(ev => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Fecha">${ev.fecha_evento}</td>
                <td data-label="Nombre">${ev.nombre_evento}</td>
                <td data-label="Lugar">${ev.lugar || "N/A"}</td>
                <td data-label="Precio">$${ev.precio_boleto}</td>
                <td data-label="Acciones">
                    <button class="btn-modificar" data-id="${ev.id_evento}">Modificar</button>
                    <button class="btn-calendario" data-id="${ev.id_evento}">📅</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


    // Filtrar 
    function filtrarEventos() {
        let filtrados = [...eventos];

        const nombre = buscarNombre.value.toLowerCase();
        const lugar = buscarLugar.value.toLowerCase();
        const inicio = fechaInicio.value ? new Date(fechaInicio.value) : null;
        const fin = fechaFin.value ? new Date(fechaFin.value) : null;

        filtrados = filtrados.filter(e => {
            const fechaEv = new Date(e.fecha_evento);
            const matchNombre = e.nombre_evento.toLowerCase().includes(nombre);
            const matchLugar = (e.lugar || "").toLowerCase().includes(lugar);
            const matchFecha =
                (!inicio || fechaEv >= inicio) &&
                (!fin || fechaEv <= fin);

            return matchNombre && matchLugar && matchFecha;
        });

        // Ordenar por fecha
        filtrados.sort((a, b) =>
            asc
                ? new Date(a.fecha_evento) - new Date(b.fecha_evento)
                : new Date(b.fecha_evento) - new Date(a.fecha_evento)
        );

        renderTabla(filtrados);
    }

    // Eventos input
    [buscarNombre, buscarLugar, fechaInicio, fechaFin].forEach(input => {
        input.addEventListener("input", filtrarEventos);
    });

    // Ordenar
    btnOrdenar.addEventListener("click", () => {
        asc = !asc;
        filtrarEventos();
    });

    btnCalendar.addEventListener("click", () => {

        const fecha = new Date();
        window.dispatchEvent(new CustomEvent("abrirCalendario", {
            detail: {
                month: fecha.getMonth(),
                year: fecha.getFullYear(),
                source: "organizer" //organizer
            }
        }));

    });

    // Botones de la tabla
    tbody.addEventListener("click", (e) => {

        if (e.target.classList.contains("btn-modificar")) {
            this.sessionStorage.setItem("evento_seleccionado", e.target.dataset.id);
            window.location.href = "events.html";

        } else if (e.target.classList.contains("btn-calendario") && e.target.id != "btnCalendar") {

            const evento = eventos.find(ev => ev.id_evento == e.target.dataset.id);
            if (evento) {
                const fecha = new Date(evento.fecha_evento);
                sessionStorage.setItem("evento_seleccionado", evento.id_evento);

                window.dispatchEvent(new CustomEvent("abrirCalendario", {
                    detail: {
                        month: fecha.getMonth(),
                        year: fecha.getFullYear(),
                        source: "event" //organizer,
                    }
                }));
            }
        }

    });

    btnAgregar.addEventListener("click", function () {
        window.location.href = "./add_events.html";
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
                document.getElementById("n_h2").innerText = organizadora.nombre_agencia;
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
                a3.href = "./add_events.html";
                const ai3 = document.createElement("img");
                ai3.src = "./../../../src/media/images/icons/icon_event.png";
                ai3.classList.add("icon_nav");
                a3.appendChild(ai3);
                a3.append("Crear evento");
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

                // Agregar funcionalidad al botón de usuario
                btn_is_r.addEventListener("click", function() {
                    mostrarModalUsuario();
                });

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

    // =====================================================
    // MODAL DE USUARIO (Cerrar sesión / Volver al inicio)
    // =====================================================
    function mostrarModalUsuario() {
        // Inyectar estilos si no existen
        if (!document.getElementById('user-modal-styles')) {
            const s = document.createElement('style');
            s.id = 'user-modal-styles';
            s.textContent = `
                .user-modal {
                    position: fixed; inset: 0; z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; visibility: hidden; transition: all 0.25s ease;
                }
                .user-modal.active { opacity: 1; visibility: visible; }
                .user-modal__overlay {
                    position: absolute; inset: 0;
                    background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(3px);
                }
                .user-modal__content {
                    position: relative; background: #fff;
                    width: 90%; max-width: 400px;
                    border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    padding: 2rem; transform: scale(0.95);
                    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .user-modal.active .user-modal__content { transform: scale(1); }
                .user-modal__header {
                    display: flex; justify-content: space-between;
                    align-items: center; margin-bottom: 1.5rem;
                }
                .user-modal__header h2 {
                    margin: 0; font-size: 1.5rem; font-weight: 700;
                    color: #1e293b;
                }
                .user-modal__close {
                    background: transparent; border: none;
                    font-size: 1.5rem; line-height: 1;
                    color: #64748b; cursor: pointer;
                    width: 32px; height: 32px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%; transition: background 0.2s;
                }
                .user-modal__close:hover {
                    background: #f1f5f9; color: #ef4444;
                }
                .user-modal__options {
                    display: flex; flex-direction: column; gap: 0.75rem;
                }
                .user-modal__option {
                    padding: 1rem; border: 2px solid #e2e8f0;
                    border-radius: 12px; cursor: pointer;
                    transition: all 0.2s ease; background: #fff;
                    display: flex; align-items: center; gap: 1rem;
                }
                .user-modal__option:hover {
                    border-color: #2563eb; background-color: #eff6ff;
                    transform: translateY(-2px);
                }
                .user-modal__option-icon {
                    font-size: 1.5rem;
                }
                .user-modal__option-text {
                    flex: 1;
                }
                .user-modal__option-title {
                    margin: 0; font-size: 1.05rem; font-weight: 600;
                    color: #1e293b;
                }
                .user-modal__option-desc {
                    margin: 0.25rem 0 0 0; font-size: 0.875rem;
                    color: #64748b;
                }
            `;
            document.head.appendChild(s);
        }

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'user-modal active';
        modal.innerHTML = `
            <div class="user-modal__overlay"></div>
            <div class="user-modal__content">
                <div class="user-modal__header">
                    <h2>Opciones de Usuario</h2>
                    <button class="user-modal__close">×</button>
                </div>
                <div class="user-modal__options">
                    <div class="user-modal__option" id="option-inicio">
                        <span class="user-modal__option-icon">🏠</span>
                        <div class="user-modal__option-text">
                            <h3 class="user-modal__option-title">Volver al Inicio</h3>
                            <p class="user-modal__option-desc">Regresar a la página principal</p>
                        </div>
                    </div>
                    <div class="user-modal__option" id="option-cerrar">
                        <span class="user-modal__option-icon">🚪</span>
                        <div class="user-modal__option-text">
                            <h3 class="user-modal__option-title">Cerrar Sesión</h3>
                            <p class="user-modal__option-desc">Salir de tu cuenta</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 250);
        };

        // Event listeners
        modal.querySelector('.user-modal__close').addEventListener('click', closeModal);
        modal.querySelector('.user-modal__overlay').addEventListener('click', closeModal);

        // Opción: Volver al inicio
        modal.querySelector('#option-inicio').addEventListener('click', () => {
            closeModal();
            window.location.href = "../../../index.html";
        });

        // Opción: Cerrar sesión
        modal.querySelector('#option-cerrar').addEventListener('click', () => {
            sessionStorage.removeItem("organizador_logeado");
            sessionStorage.removeItem("evento_seleccionado");
            closeModal();
            window.location.href = "../../../index.html";
        });
    }
});
