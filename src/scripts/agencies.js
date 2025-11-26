

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
            sessionStorage.removeItem("agencia_logeado");
            sessionStorage.removeItem("paquete_seleccionado");
            closeModal();
            window.location.href = "../../../index.html";
        });
    }
});
