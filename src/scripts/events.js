// events.js - Versión Completa y Mejorada

// =====================================================
// 1. VALIDACIÓN DE SESIÓN Y REFERENCIAS
// =====================================================
let idEvento = sessionStorage.getItem("evento_seleccionado");

if (!idEvento) {
    window.location.href = "../../../index.html";
}

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
const miniCalendar = document.getElementById("event-calendar");

// Botones
const btnEdit = document.getElementById("btn-edit");
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");

// Estado Global
let evento = null;
let lugar = null;
let organizador = null;
let tipoActividad = null;
let nuevaImagenArchivo = null;
let editMode = false;
let currentProfile = JSON.parse(sessionStorage.getItem("organizador_logeado"));

// =====================================================
// 2. INYECCIÓN DE ESTILOS (CSS EN JS)
// =====================================================
/* Esto asegura que los modales se vean bien sin tocar tu CSS global */
(function injectModalStyles() {
    if (document.getElementById('app-modal-styles')) return;
    const s = document.createElement('style');
    s.id = 'app-modal-styles';
    s.textContent = `
    :root {
        --modal-bg: #ffffff;
        --modal-overlay: rgba(15, 23, 42, 0.65);
        --modal-border: #e2e8f0;
        --modal-radius: 16px;
        --modal-primary: #2563eb;
        --modal-text: #1e293b;
        --modal-text-light: #64748b;
    }

    .app-modal {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        opacity: 0; visibility: hidden; transition: all 0.25s ease;
        font-family: 'Inter', system-ui, sans-serif;
    }
    .app-modal.active { opacity: 1; visibility: visible; }
    
    .app-modal__overlay {
        position: absolute; inset: 0;
        background: var(--modal-overlay);
        backdrop-filter: blur(5px);
    }

    .app-modal__content {
        position: relative; background: var(--modal-bg);
        width: 90%; max-width: 600px; max-height: 85vh;
        border-radius: var(--modal-radius);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        display: flex; flex-direction: column;
        transform: scale(0.95); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
    }
    .app-modal.active .app-modal__content { transform: scale(1); }

    .app-modal__header {
        padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--modal-border);
        display: flex; justify-content: space-between; align-items: center; background: #fff;
    }
    .app-modal__header h2 { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--modal-text); }
    
    .app-modal__close {
        background: transparent; border: none; font-size: 1.5rem; line-height: 1;
        color: var(--modal-text-light); cursor: pointer; border-radius: 50%;
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
    }
    .app-modal__close:hover { background: #f1f5f9; color: #ef4444; }

    .app-modal__body { padding: 1.5rem; overflow-y: auto; }

    /* Inputs y Grid */
    .modal-search {
        width: 100%; padding: 0.85rem 1rem; margin-bottom: 1.5rem;
        border: 1px solid var(--modal-border); border-radius: 10px;
        font-size: 1rem; background-color: #f8fafc; outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    .modal-search:focus { border-color: var(--modal-primary); background: #fff; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

    .selection-grid { display: flex; flex-direction: column; gap: 0.75rem; }

    .selection-card {
        display: flex; gap: 1rem; padding: 1rem;
        border: 1px solid var(--modal-border); border-radius: 12px;
        cursor: pointer; transition: all 0.2s ease; background: #fff;
        align-items: flex-start;
    }
    .selection-card:hover {
        border-color: var(--modal-primary); background-color: #eff6ff;
        transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .selection-card__img {
        width: 80px; height: 80px; flex-shrink: 0;
        border-radius: 8px; object-fit: cover;
        background-color: #f1f5f9; border: 1px solid #e2e8f0;
    }
    
    .selection-card__info { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .selection-card__title { margin: 0; font-size: 1.05rem; font-weight: 600; color: var(--modal-text); }
    .selection-card__desc { 
        margin: 0; font-size: 0.9rem; color: var(--modal-text-light); line-height: 1.4;
        display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }

    .app-modal__actions {
        padding: 1rem 1.5rem; border-top: 1px solid var(--modal-border);
        display: flex; justify-content: flex-end; gap: 0.75rem; background: #fafafa;
    }
    .btn-modal { padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
    .btn-modal--primary { background: var(--modal-primary); color: white; }
    .btn-modal--primary:hover { background: #1d4ed8; }
    .btn-modal--secondary { background: white; border: 1px solid var(--modal-border); color: var(--modal-text); }
    .btn-modal--secondary:hover { background: #f1f5f9; }
    `;
    document.head.appendChild(s);
})();

// =====================================================
// 3. UTILIDADES DE MODALES (Alerta, Confirm, Selección)
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

function showConfirm(title = 'Confirmar', message = '') {
    ensureModalContainer();
    return new Promise((resolve) => {
        const container = document.getElementById('app-modals');
        const modal = document.createElement('div');
        modal.className = 'app-modal active';
        modal.innerHTML = `
            <div class="app-modal__overlay"></div>
            <div class="app-modal__content" style="max-width: 480px;">
                <div class="app-modal__header">
                    <h2>${title}</h2>
                    <button class="app-modal__close">×</button>
                </div>
                <div class="app-modal__body">
                    <p style="margin:0; color:#475569; font-size:1rem; line-height:1.6;">${message}</p>
                </div>
                <div class="app-modal__actions">
                    <button class="btn-modal btn-modal--secondary app-modal__cancel">Cancelar</button>
                    <button class="btn-modal btn-modal--primary app-modal__ok">Confirmar</button>
                </div>
            </div>
        `;
        container.appendChild(modal);

        const close = (result) => { modal.classList.remove('active'); setTimeout(() => modal.remove(), 250); resolve(result); };
        modal.querySelector('.app-modal__close').addEventListener('click', () => close(false));
        modal.querySelector('.app-modal__cancel').addEventListener('click', () => close(false));
        modal.querySelector('.app-modal__overlay').addEventListener('click', () => close(false));
        modal.querySelector('.app-modal__ok').addEventListener('click', () => close(true));
    });
}

/**
 * Modal de Selección Avanzado (Lista con Imágenes y Descripción)
 * @param {string} titulo - Título del modal
 * @param {Array} lista - Array de objetos a listar
 * @param {object} config - Configuración de mapeo { keyNombre, keyDesc, keyImg, pathImg }
 * @param {function} callback - Función a ejecutar al seleccionar
 */
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

        // Filtrar
        const filtrados = lista.filter(item => {
            const nombre = (item[config.keyNombre] || '').toLowerCase();
            const desc = (item[config.keyDesc] || '').toLowerCase();
            return nombre.includes(lowerFilter) || desc.includes(lowerFilter);
        });

        if (filtrados.length === 0) {
            grid.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:2rem;">No se encontraron resultados.</div>`;
            return;
        }

        // Crear tarjetas
        filtrados.forEach(item => {
            const card = document.createElement('div');
            card.className = 'selection-card';

            // Imagen (si está configurada)
            let imgHTML = '';
            if (config.keyImg && item[config.keyImg]) {
                const src = `${config.pathImg}/${item[config.keyImg]}`;
                imgHTML = `<img src="${src}" class="selection-card__img" alt="Img" onerror="this.style.display='none'">`;
            } else if (config.pathImg) {

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

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 250);
    };

    search.addEventListener('input', (e) => render(e.target.value));
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    render(''); // Render inicial
    setTimeout(() => search.focus(), 100);
}


// =====================================================
// 4. LOGICA DEL EVENTO (Carga inicial)
// =====================================================
window.addEventListener("load", async function () {
    try {
        const res = await fetch(`../../data/Logic/eventController.php?accion=evento&idEvento=${idEvento}`);
        const json = await res.json();

        if (!json.correcto) throw new Error(json.mensaje);

        evento = json.data;

        // Cargas secundarias (Lugar, Org, Tipo)
        const resLugar = await fetch(`../../data/Logic/eventController.php?accion=lugar&idLugar=${evento.id_lugar}`);
        const jsonLugar = await resLugar.json();
        if (jsonLugar.correcto) lugar = jsonLugar.data;

        const resOrg = await fetch(`../../data/Logic/eventController.php?accion=organizadora&idOrganizadora=${evento.id_organizadora}`);
        const jsonOrg = await resOrg.json();
        if (jsonOrg.correcto) organizador = jsonOrg.data;

        const resTipoA = await fetch(`../../data/Logic/eventController.php?accion=actividad&idActividad=${evento.id_tipo_actividad}`);
        const jsonTipoA = await resTipoA.json();
        if (jsonTipoA.correcto) tipoActividad = jsonTipoA.data;

        cargarEventoEnUI();
        footer_header(); //Crear footer y header

    } catch (e) {
        console.error("Error:", e);
        showAlert('Error', 'No se pudieron cargar los datos del evento.');
    }
});

function cargarEventoEnUI() {
    try {
        editMode = false;

        // Imagen
        img.src = evento.imagen_url ? `../../../src/media/images/events/${evento.imagen_url}` : '';
        img.alt = evento.nombre_evento || 'Evento';

        // Inputs
        nameInput.value = evento.nombre_evento || '';
        descInput.value = evento.descripcion || '';
        timeInput.value = evento.hora_evento || '';
        priceInput.value = evento.precio_boleto || '';

        // Tarjetas
        actualizarTarjetaLugar();
        actualizarTarjetaTipo();

        // Organizador
        organizerEl.textContent = organizador
            ? `Organizado por: ${organizador.nombre_agencia}`
            : "Organizador desconocido";

        if (organizador?.image_url) {
            organizerImg.style.backgroundImage = `url(../../../src/media/images/organizers/${organizador.image_url})`;
        }

        // Estado inicial UI
        actualizarEstadoUI();

        // Mini Calendario Setup
        const fechaEvento = new Date(evento.fecha_evento);
        miniCalendar.addEventListener("click", () => {
            window.eventosCalendario = [evento];
            window.dispatchEvent(new CustomEvent("abrirCalendario", {
                detail: { month: fechaEvento.getMonth(), year: fechaEvento.getFullYear(), source: "event" },
            }));
            document.getElementById("calendar-modal").classList.add("active");
        });

    } catch (error) {
        console.error("Error UI:", error);
    }
}

function actualizarTarjetaLugar() {
    placeEl.innerHTML = ''; // Limpiar contenido previo
    if (lugar) {
        placeEl.innerHTML = `<div style="display:flex; flex-direction:column; gap:4px;">
            <span>${lugar.nombre_lugar}</span>
            <small style="font-weight:400; font-size:0.8em; opacity:0.8;">${lugar.direccion || ''}</small>
        </div>`;
    } else {
        placeEl.textContent = "Seleccionar Lugar";
    }
}

function actualizarTarjetaTipo() {
    typeEl.innerHTML = '';
    if (tipoActividad) {
        // Icono pequeño o imagen si quieres mostrarla en la tarjeta minimizada
        typeEl.innerHTML = `<span>${tipoActividad.nombre_tipo_actividad}</span>`;
    } else {
        typeEl.textContent = "Seleccionar Actividad";
    }
}

function actualizarEstadoUI() {
    // Inputs
    [nameInput, descInput, timeInput, priceInput, fileInput].forEach(el => el.disabled = !editMode);

    // Punteros e interactividad
    const cursorStyle = editMode ? 'pointer' : 'default';
    const borderStyle = editMode ? '2px dashed #2563eb' : 'none'; // Indicador visual de edición

    placeEl.style.cursor = cursorStyle;
    placeEl.style.pointerEvents = editMode ? 'auto' : 'none';
    if (editMode) placeEl.style.border = borderStyle; else placeEl.style.border = '';

    typeEl.style.cursor = cursorStyle;
    typeEl.style.pointerEvents = editMode ? 'auto' : 'none';
    if (editMode) typeEl.style.border = borderStyle; else typeEl.style.border = '';

    img.style.cursor = cursorStyle;
    img.style.pointerEvents = editMode ? 'auto' : 'none';

    // Botones
    btnSave.disabled = !editMode;
    btnEdit.textContent = editMode ? 'Cancelar edición' : '✏ Iniciar edición';

    // Visibilidad de botones admin
    const puedeEditar = evento.id_organizadora === currentProfile?.id_organizadora;
    if (!puedeEditar) {
        btnEdit.style.display = 'none';
        btnDelete.style.display = 'none';
    } else {
        btnEdit.style.display = 'inline-block';
        btnDelete.style.display = 'inline-block';
    }
}

// =====================================================
// 5. INTERACCIONES DE USUARIO
// =====================================================

// Botón Editar
btnEdit.addEventListener("click", () => {
    editMode = !editMode;
    actualizarEstadoUI();

    if (!editMode) {
        // Cancelar: Recargar todo para perder cambios no guardados
        fileInput.value = '';
        nuevaImagenArchivo = null;
        cargarEventoEnUI();
    }
});

// Click en Imagen
img.addEventListener('click', () => {
    if (!editMode) return;
    fileInput.accept = 'image/png, image/jpeg';
    fileInput.click();
});

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        showAlert('Formato', 'Por favor usa imágenes PNG o JPEG.');
        fileInput.value = '';
        return;
    }
    nuevaImagenArchivo = file;
    const reader = new FileReader();
    reader.onload = (e) => img.src = e.target.result;
    reader.readAsDataURL(file);
});

// Click en LUGAR (Abre modal rico)
placeEl.addEventListener('click', async () => {
    if (!editMode) return;
    try {
        const res = await fetch("../../data/Logic/eventController.php?accion=lugares");
        const json = await res.json();
        if (!json.correcto) return showAlert('Error', 'Falló la carga de lugares');

        // Configuración para el modal: nombre, descripción (dirección) y sin imagen
        const config = {
            keyNombre: 'nombre_lugar',
            keyDesc: 'descripcion',
            keyImg: 'imagen_url',         // Campo nombre de archivo imagen
            pathImg: '../../../src/media/images/lugares/'
        };

        mostrarModalSeleccion('Selecciona un Lugar', json.data, config, (sel) => {
            lugar = sel;
            actualizarTarjetaLugar();
        });

    } catch (err) {
        console.error(err);
        showAlert('Error', 'No se pudo conectar con el servidor');
    }
});

// Click en TIPO DE ACTIVIDAD (Abre modal rico con imagenes)
typeEl.addEventListener('click', async () => {
    if (!editMode) return;
    try {
        const res = await fetch("../../data/Logic/eventController.php?accion=tipos");
        const json = await res.json();
        if (!json.correcto) return showAlert('Error', 'Falló la carga de tipos');

        // Configuración para el modal: nombre, descripción e imagen
        const config = {
            keyNombre: 'nombre_tipo_actividad',
            keyDesc: 'descripcion', // Campo descripción de tu BD
            pathImg: '../../../src/media/images/activity_types' // Ruta base imágenes
        };

        mostrarModalSeleccion('Selecciona Tipo de Actividad', json.data, config, (sel) => {
            tipoActividad = sel;
            actualizarTarjetaTipo();
        });

    } catch (err) {
        console.error(err);
        showAlert('Error', 'No se pudo conectar con el servidor');
    }
});

// =====================================================
// 6. GUARDAR Y ELIMINAR
// =====================================================

btnSave.addEventListener("click", async () => {
    try {
        if (!nameInput.value.trim()) return showAlert('Faltan datos', 'El nombre es obligatorio.');

        const formData = new FormData();

        formData.append("fecha_evento", fecha)
        formData.append("accion", "actualizar");
        formData.append("idEvento", idEvento);
        formData.append("nombre_evento", nameInput.value);
        formData.append("descripcion", descInput.value);
        formData.append("hora_evento", timeInput.value);
        formData.append("precio_boleto", priceInput.value);

        // IDs foráneos
        formData.append("id_lugar", lugar?.id_lugar ?? evento.id_lugar);
        formData.append("id_tipo_actividad", tipoActividad?.id_tipo_actividad ?? evento.id_tipo_actividad);

        if (nuevaImagenArchivo) formData.append('imagen', nuevaImagenArchivo);

        const res = await fetch("../../data/Logic/eventController.php", {
            method: "POST", body: formData
        });
        const json = await res.json();

        if (!json.correcto) return showAlert('Error', json.mensaje || 'Error al guardar');

        // Actualizar objeto local con la respuesta o los inputs
        if (json.data) {
            evento = json.data;
            if (json.data.lugar) lugar = json.data.lugar;
            if (json.data.tipoActividad) tipoActividad = json.data.tipoActividad;
        } else {
            // Fallback manual si el server no devuelve el objeto completo
            evento.nombre_evento = nameInput.value;
            evento.descripcion = descInput.value;
            evento.hora_evento = timeInput.value;
            evento.precio_boleto = priceInput.value;
            if (json.nueva_imagen_url) evento.imagen_url = json.nueva_imagen_url;
        }

        // Refrescar imagen si cambió desde server
        if (evento.imagen_url) img.src = `../../../src/media/images/events/${evento.imagen_url}`;

        nuevaImagenArchivo = null;
        editMode = false;
        actualizarEstadoUI();

        await showAlert('Éxito', 'Evento actualizado correctamente.');

    } catch (err) {
        console.error(err);
        showAlert('Error', 'Ocurrió un error inesperado al guardar.');
    }
});

btnDelete.addEventListener("click", async () => {
    try {
    
        const confirmar = await showConfirm('Eliminar', '¿Realmente deseas eliminar este evento? No se puede deshacer.');
        if (!confirmar) return;

        const formData = new FormData();

        formData.append("idEvento", idEvento);
        formData.append("accion", "eliminar");

        const res = await fetch("../../data/Logic/eventController.php", {
            method: "POST",
            body: formData
        });
                console.log(await res.text());

        const json = await res.json();
        console.log(json);

        if (!json.correcto) return showAlert('Error', json.mensaje);

        await showAlert('Eliminado', 'El evento ha sido eliminado.');
        sessionStorage.removeItem("evento_seleccionado");
        window.location.href = "./organizers.html";
    } catch (err) {
        console.error(err);
        showAlert('Error', 'No se pudo eliminar el evento, el evento ya ha sido seleccionado por los clientes.');
    }
});


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
            document.getElementById("n_h2").innerText = evento.nombre_evento;
            document.getElementById("s_icon").setAttribute("src", "./../../../src/media/images/icons/icon_arc.png");
            const bnav = document.getElementById("underline_nav");


            /*Primero*/
            const a1 = document.createElement("a");
            a1.id = "a1";
            a1.href = "organizer.html";
            const ai1 = document.createElement("img");
            ai1.src = "./../../../src/media/images/icons/icon_home.png";
            ai1.classList.add("icon_nav");
            a1.appendChild(ai1);
            a1.append("Pagina Principal");
            bnav.appendChild(a1);

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

            btn_is_r.addEventListener("click", () => {
                window.location.href = "../../../index.html";
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