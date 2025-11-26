// =====================================================
// 1. CONFIGURACIÓN INICIAL Y REFERENCIAS
// =====================================================

// Limpiamos cualquier rastro de selección previa
sessionStorage.removeItem("evento_seleccionado");

// Referencias DOM
const img = document.getElementById("event-img");
const fileInput = document.getElementById("file_event_img");
const nameInput = document.getElementById("event-name");
const descInput = document.getElementById("event-desc");
const timeInput = document.getElementById("event-time");
const priceInput = document.getElementById("event-price");

// Tarjetas interactivas
const placeEl = document.getElementById("event-place");
const typeEl = document.getElementById("event-type");
const organizerEl = document.getElementById("event-organizer");
const organizerImg = document.getElementById("event-organizer-img");
const btnCalendar = document.getElementById("event-calendar");

// Botones de acción
const btnEdit = document.getElementById("btn-edit"); // Se ocultará
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete"); // Se ocultará

// Estado Global
let lugarSeleccionado = null;
let tipoActividadSeleccionado = null;
let nuevaImagenArchivo = null;
let organizador = JSON.parse(sessionStorage.getItem("organizador_logeado")) || null;

// Variable global para la fecha (gestionada por calendar.js)
// window.calendarday se asume que es seteada por el módulo de calendario.


// =====================================================
// 2. INYECCIÓN DE ESTILOS (MANTENIDO IGUAL)
// =====================================================
(function injectModalStyles() {
    if (document.getElementById('app-modal-styles')) return;
    const s = document.createElement('style');
    s.id = 'app-modal-styles';
    s.textContent = `
    :root { --modal-bg: #ffffff; --modal-overlay: rgba(15, 23, 42, 0.65); --modal-border: #e2e8f0; --modal-radius: 16px; --modal-primary: #2563eb; --modal-text: #1e293b; --modal-text-light: #64748b; }
    .app-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: all 0.25s ease; font-family: 'Inter', system-ui, sans-serif; }
    .app-modal.active { opacity: 1; visibility: visible; }
    .app-modal__overlay { position: absolute; inset: 0; background: var(--modal-overlay); backdrop-filter: blur(5px); }
    .app-modal__content { position: relative; background: var(--modal-bg); width: 90%; max-width: 600px; max-height: 85vh; border-radius: var(--modal-radius); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); display: flex; flex-direction: column; transform: scale(0.95); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; }
    .app-modal.active .app-modal__content { transform: scale(1); }
    .app-modal__header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--modal-border); display: flex; justify-content: space-between; align-items: center; background: #fff; }
    .app-modal__header h2 { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--modal-text); }
    .app-modal__close { background: transparent; border: none; font-size: 1.5rem; line-height: 1; color: var(--modal-text-light); cursor: pointer; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .app-modal__close:hover { background: #f1f5f9; color: #ef4444; }
    .app-modal__body { padding: 1.5rem; overflow-y: auto; }
    .modal-search { width: 100%; padding: 0.85rem 1rem; margin-bottom: 1.5rem; border: 1px solid var(--modal-border); border-radius: 10px; font-size: 1rem; background-color: #f8fafc; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
    .modal-search:focus { border-color: var(--modal-primary); background: #fff; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    .selection-grid { display: flex; flex-direction: column; gap: 0.75rem; }
    .selection-card { display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--modal-border); border-radius: 12px; cursor: pointer; transition: all 0.2s ease; background: #fff; align-items: flex-start; }
    .selection-card:hover { border-color: var(--modal-primary); background-color: #eff6ff; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .selection-card__img { width: 80px; height: 80px; flex-shrink: 0; border-radius: 8px; object-fit: cover; background-color: #f1f5f9; border: 1px solid #e2e8f0; }
    .selection-card__info { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .selection-card__title { margin: 0; font-size: 1.05rem; font-weight: 600; color: var(--modal-text); }
    .selection-card__desc { margin: 0; font-size: 0.9rem; color: var(--modal-text-light); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .app-modal__actions { padding: 1rem 1.5rem; border-top: 1px solid var(--modal-border); display: flex; justify-content: flex-end; gap: 0.75rem; background: #fafafa; }
    .btn-modal { padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
    .btn-modal--primary { background: var(--modal-primary); color: white; }
    .btn-modal--primary:hover { background: #1d4ed8; }
    .btn-modal--secondary { background: white; border: 1px solid var(--modal-border); color: var(--modal-text); }
    .btn-modal--secondary:hover { background: #f1f5f9; }
    `;
    document.head.appendChild(s);
})();

// =====================================================
// 3. UTILIDADES DE MODALES (MANTENIDO IGUAL)
// =====================================================

function ensureModalContainer() {
    if (!document.getElementById('app-modals')) {
        const c = document.createElement('div');
        c.id = 'app-modals';
        document.body.appendChild(c);
    }
}

function showAlert(title = 'Aviso', message = '', okText = 'Entendido') {
    ensureModalContainer();
    return new Promise((resolve) => {
        const container = document.getElementById('app-modals');
        const modal = document.createElement('div');
        modal.className = 'app-modal active';
        modal.innerHTML = `
            <div class="app-modal__overlay"></div>
            <div class="app-modal__content" style="max-width: 450px;">
                <div class="app-modal__header">
                    <h2>${title}</h2>
                    <button class="app-modal__close">×</button>
                </div>
                <div class="app-modal__body">
                    <p style="margin:0; color:#475569; font-size:1rem; line-height:1.6;">${message}</p>
                </div>
                <div class="app-modal__actions">
                    <button class="btn-modal btn-modal--primary app-modal__ok">${okText}</button>
                </div>
            </div>
        `;
        container.appendChild(modal);
        const close = () => { modal.classList.remove('active'); setTimeout(() => modal.remove(), 250); resolve(); };
        modal.querySelector('.app-modal__close').addEventListener('click', close);
        modal.querySelector('.app-modal__ok').addEventListener('click', close);
        modal.querySelector('.app-modal__overlay').addEventListener('click', close);
    });
}

function mostrarModalSeleccion(titulo, lista, config, callback) {
    ensureModalContainer();
    const container = document.getElementById('app-modals');
    const modal = document.createElement('div');
    modal.className = 'app-modal active';

    modal.innerHTML = `
        <div class="app-modal__overlay"></div>
        <div class="app-modal__content">
            <div class="app-modal__header">
                <h2>${titulo}</h2>
                <button class="app-modal__close">×</button>
            </div>
            <div class="app-modal__body">
                <input type="search" class="modal-search" placeholder="Buscar...">
                <div class="selection-grid" id="modal-grid-container"></div>
            </div>
        </div>
    `;
    container.appendChild(modal);

    const grid = modal.querySelector('#modal-grid-container');
    const search = modal.querySelector('.modal-search');
    const closeBtn = modal.querySelector('.app-modal__close');
    const overlay = modal.querySelector('.app-modal__overlay');

    function render(filter = '') {
        grid.innerHTML = '';
        const lowerFilter = filter.toLowerCase();
        const filtrados = lista.filter(item => {
            const nombre = (item[config.keyNombre] || '').toLowerCase();
            const desc = (item[config.keyDesc] || '').toLowerCase();
            return nombre.includes(lowerFilter) || desc.includes(lowerFilter);
        });

        if (filtrados.length === 0) {
            grid.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:2rem;">No se encontraron resultados.</div>`;
            return;
        }

        filtrados.forEach(item => {
            const card = document.createElement('div');
            card.className = 'selection-card';
            let imgHTML = '';
            if (config.keyImg && item[config.keyImg]) {
                const src = `${config.pathImg}/${item[config.keyImg]}`;
                imgHTML = `<img src="${src}" class="selection-card__img" alt="Img" onerror="this.style.display='none'">`;
            }
            const descText = item[config.keyDesc] || 'Sin descripción disponible';
            card.innerHTML = `
                ${imgHTML}
                <div class="selection-card__info">
                    <h4 class="selection-card__title">${item[config.keyNombre]}</h4>
                    <p class="selection-card__desc">${descText}</p>
                </div>
            `;
            card.addEventListener('click', () => {
                callback(item);
                closeModal();
            });
            grid.appendChild(card);
        });
    }

    const closeModal = () => { modal.classList.remove('active'); setTimeout(() => modal.remove(), 250); };
    search.addEventListener('input', (e) => render(e.target.value));
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    render('');
    setTimeout(() => search.focus(), 100);
}


// =====================================================
// 4. LÓGICA DE INICIO (SIEMPRE MODO CREACIÓN)
// =====================================================
window.addEventListener("load", async function () {
    try {
        footer_header(); // Cargar layout

        // 1. Ocultar elementos de edición/eliminación que no se usan
        if (btnEdit) btnEdit.style.display = "none";
        if (btnDelete) btnDelete.style.display = "none";

        // 2. Prellenar datos del organizador logueado
        if (organizador) {
            organizerEl.textContent = `Organizado por: ${organizador.nombre_agencia}`;
            if (organizador.image_url) {
                organizerImg.style.backgroundImage = `url(../../../src/media/images/organizers/${organizador.image_url})`;
            }
        } else {
            organizerEl.textContent = "Organizador (No logueado)";
        }

        // 3. Inicializar el formulario habilitado
        inicializarFormularioCreacion();

    } catch (e) {
        console.error("Error al iniciar:", e);
        showAlert("Error", "No se pudo iniciar el formulario.");
    }
});

function inicializarFormularioCreacion() {
    // Habilitar todos los inputs
    [nameInput, descInput, timeInput, priceInput, fileInput].forEach(el => el.disabled = false);
    btnSave.disabled = false;
    btnSave.textContent = "Crear Evento"; // Texto explícito

    // Estilos de interacción
    placeEl.style.cursor = 'pointer';
    placeEl.style.border = '2px dashed #2563eb';

    typeEl.style.cursor = 'pointer';
    typeEl.style.border = '2px dashed #2563eb';

    img.style.cursor = 'pointer';

    // Resetear visuales de tarjetas
    actualizarTarjetaLugar();
    actualizarTarjetaTipo();
}

function actualizarTarjetaLugar() {
    placeEl.innerHTML = '';
    if (lugarSeleccionado) {
        placeEl.innerHTML = `<div style="display:flex; flex-direction:column; gap:4px;">
            <span style="font-weight:bold; color:#2563eb;">${lugarSeleccionado.nombre_lugar}</span>
            <small style="font-weight:400; font-size:0.8em; opacity:0.8;">${lugarSeleccionado.direccion || ''}</small>
        </div>`;
    } else {
        placeEl.textContent = "Seleccionar Lugar";
        placeEl.classList.remove("fill");
    }
}

function actualizarTarjetaTipo() {
    typeEl.innerHTML = '';
    if (tipoActividadSeleccionado) {
        typeEl.innerHTML = `<span style="font-weight:bold; color:#2563eb;">${tipoActividadSeleccionado.nombre_tipo_actividad}</span>`;
    } else {
        typeEl.textContent = "Seleccionar Actividad";
        typeEl.classList.remove("fill");
    }
}


// 5. INTERACCIONES (SELECCIÓN DE DATOS)


// =====================================================
// 5. INTERACCIONES (SELECCIÓN DE DATOS)
// =====================================================

// Selección de Imagen
img.addEventListener('click', () => {
    fileInput.accept = 'image/png, image/jpeg';
    fileInput.click();
});

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        showAlert('Formato Incorrecto', 'Por favor usa imágenes PNG o JPEG.');
        fileInput.value = '';
        return;
    }
    nuevaImagenArchivo = file;
    const reader = new FileReader();
    reader.onload = (e) => img.src = e.target.result;
    reader.readAsDataURL(file);
});

// Selección de Lugar
placeEl.addEventListener('click', async () => {
    try {
        const res = await fetch("../../data/Logic/eventController.php?accion=lugares");
        const json = await res.json();
        if (!json.correcto) return showAlert('Error', 'Falló la carga de lugares');

        const config = {
            keyNombre: 'nombre_lugar',
            keyDesc: 'descripcion',
            keyImg: 'imagen_url',
            pathImg: '../../../src/media/images/lugares/'
        };

        mostrarModalSeleccion('Selecciona un Lugar', json.data, config, (sel) => {
            lugarSeleccionado = sel;
            actualizarTarjetaLugar();
        });
    } catch (err) {
        console.error(err);
        showAlert('Error', 'Error de conexión al obtener lugares.');
    }
});

// Selección de Tipo de Actividad
typeEl.addEventListener('click', async () => {
    try {
        const res = await fetch("../../data/Logic/eventController.php?accion=tipos");
        const json = await res.json();
        if (!json.correcto) return showAlert('Error', 'Falló la carga de tipos de actividad');

        const config = {
            keyNombre: 'nombre_tipo_actividad',
            keyDesc: 'descripcion',
            pathImg: '../../../src/media/images/activity_types'
        };

        mostrarModalSeleccion('Selecciona Tipo de Actividad', json.data, config, (sel) => {
            tipoActividadSeleccionado = sel;
            actualizarTarjetaTipo();
        });
    } catch (err) {
        console.error(err);
        showAlert('Error', 'Error de conexión al obtener tipos.');
    }
});

// Abrir Calendario
btnCalendar.addEventListener("click", () => {
    // Disparamos evento para que calendar.js abra el modal
    const hoy = new Date();
    window.dispatchEvent(new CustomEvent("abrirCalendario", {
        detail: { month: hoy.getMonth(), year: hoy.getFullYear(), source: "create_event" }
    }));
    document.getElementById("calendar-modal").classList.add("active");
});


// =====================================================
// 6. GUARDAR (CREAR) EVENTO
// =====================================================

btnSave.addEventListener("click", async () => {
    try {
        // --- VALIDACIONES ---
        if (!nameInput.value.trim()) return showAlert('Faltan datos', 'El nombre del evento es obligatorio.');
        if (!timeInput.value) return showAlert('Faltan datos', 'La hora del evento es obligatoria.');
        if (!lugarSeleccionado) return showAlert('Faltan datos', 'Debes seleccionar un Lugar.');
        if (!tipoActividadSeleccionado) return showAlert('Faltan datos', 'Debes seleccionar un Tipo de Actividad.');

        // --- VALIDACIÓN DE FECHA (REQUERIMIENTO PRINCIPAL) ---
        if (!window.calendarState.selectedDay) {
            return showAlert('Fecha Requerida', 'No has seleccionado una fecha. Por favor abre el calendario y elige un día.');
        }

        // Fecha
        const fecha = new Date(window.calendarState.selectedDay.year, window.calendarState.selectedDay.month - 1, window.calendarState.selectedDay.day); // 11 es diciembre
        const fechaFormateada = fecha.toISOString().split('T')[0];

        console.log(fechaFormateada);

        // --- PREPARAR FORMDATA ---
        const formData = new FormData();

        // Acción: CREAR 
        formData.append("accion", "crear");

        // Datos básicos
        formData.append("nombre_evento", nameInput.value);
        formData.append("descripcion", descInput.value);
        formData.append("hora_evento", timeInput.value);
        formData.append("precio_boleto", priceInput.value || 0);

        // Fecha obtenida de la variable global del calendario
        formData.append("fecha_evento", fechaFormateada);

        // Claves foráneas
        formData.append("id_lugar", lugarSeleccionado.id_lugar);
        formData.append("id_tipo_actividad", tipoActividadSeleccionado.id_tipo_actividad);

        // ID Organizador (si aplica en tu backend)
        if (organizador && organizador.id_organizadora) {
            formData.append("id_organizador", organizador.id_organizadora);
        }

        // Imagen
        if (nuevaImagenArchivo) {
            formData.append('imagen', nuevaImagenArchivo);
        } else {
            // Opcional: Validar si la imagen es obligatoria al crear
            return showAlert('Imagen requerida', 'Debes subir una imagen para el evento.');
        }

        // --- ENVIAR AL SERVIDOR ---
        const res = await fetch("../../data/Logic/eventController.php", {
            method: "POST", body: formData
        });

        // Manejo de respuesta textual por si hay errores de PHP no JSON
        const text = await res.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            console.error("Respuesta no JSON:", text);
            throw new Error("El servidor devolvió una respuesta inválida.");
        }

        if (!json.correcto) {
            return showAlert('Error del Servidor', json.mensaje || 'No se pudo crear el evento.');
        }

        await showAlert('Éxito', '¡El evento ha sido creado correctamente!');

        // Recargar página para limpiar o redirigir
        window.location.href = "./organizers.html";
        // window.location.reload();

    } catch (err) {
        console.error(err);
        showAlert('Error Inesperado', 'Ocurrió un error al intentar guardar el evento.');
    }
});


// =====================================================
// 7. HEADER Y FOOTER 
// =====================================================
function footer_header() {
    fetch("./../../../src/components/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            const script = document.createElement("script");
            script.src = "./../../../src/scripts/header_script.js";
            document.body.appendChild(script);

            const s_header = document.getElementById("s_header");
            if (s_header) s_header.style.backgroundImage = "url(./../../../src/media/images/layout/img_background_header.jpg)";

            if (document.getElementById("n_h2")) document.getElementById("n_h2").innerText = "Crear nuevo evento";
            if (document.getElementById("s_icon")) document.getElementById("s_icon").setAttribute("src", "./../../../src/media/images/icons/icon_arc.png");
            
            // Agregar funcionalidad al botón de usuario si existe
            setTimeout(() => {
                const btn_is_r = document.getElementById("btn_is_r");
                if (btn_is_r) {
                    btn_is_r.addEventListener("click", function() {
                        mostrarModalUsuario();
                    });
                }
            }, 100);
            
        });

    fetch("./../../../src/components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
            if (document.getElementById("f_icon")) document.getElementById("f_icon").src = "./../../../src/media/images/icons/icon_arc.png";
            const f_general = document.getElementById("f_general");
            if (f_general) {
                f_general.style.backgroundImage = "url(./../../../src/media/images/layout/imgLayout20.jpg)";
                f_general.style.backgroundPosition = "50% 80%";
            }
        });
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