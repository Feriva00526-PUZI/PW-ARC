// packages_agency.js - Versión para Editar Paquetes de Agencias

// =====================================================
// 1. VALIDACIÓN DE SESIÓN Y REFERENCIAS
// =====================================================
let idPaquete = sessionStorage.getItem("paquete_seleccionado");

if (!idPaquete) {
    window.location.href = "../../../index.html";
}

// Referencias DOM
const img = document.getElementById("package-img");
const fileInput = document.getElementById("file_package_img");
const nameInput = document.getElementById("package-name");
const descInput = document.getElementById("package-desc");
const priceInput = document.getElementById("package-price");

// Tarjetas interactivas
const placeEl = document.getElementById("package-place");
const agencyEl = document.getElementById("package-agency");
const agencyImg = document.getElementById("package-agency-img");

// Botones
const btnEdit = document.getElementById("btn-edit");
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");

// Estado Global
let paquete = null;
let lugar = null;
let agencia = null;
let nuevaImagenArchivo = null;
let editMode = false;
let currentProfile = JSON.parse(sessionStorage.getItem("agencia_logeado"));

// =====================================================
// 2. INYECCIÓN DE ESTILOS (CSS EN JS)
// =====================================================
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
// 3. UTILIDADES DE MODALES
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

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 250);
    };

    search.addEventListener('input', (e) => render(e.target.value));
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    render('');
    setTimeout(() => search.focus(), 100);
}

// =====================================================
// 4. LOGICA DEL PAQUETE (Carga inicial)
// =====================================================
window.addEventListener("load", async function () {
    try {
        const res = await fetch(`../../data/Logic/packageAgencyController.php?accion=paquete&idPaquete=${idPaquete}`);
        const json = await res.json();

        if (!json.correcto) throw new Error(json.mensaje);

        paquete = json.data;

        // Cargas secundarias (Lugar, Agencia)
        const resLugar = await fetch(`../../data/Logic/packageAgencyController.php?accion=lugar&idLugar=${paquete.id_lugar}`);
        const jsonLugar = await resLugar.json();
        if (jsonLugar.correcto) lugar = jsonLugar.data;

        if (paquete.id_agencia) {
            const resAgencia = await fetch(`../../data/Logic/agencyController.php?accion=agencia&idAgencia=${paquete.id_agencia}`);
            const jsonAgencia = await resAgencia.json();
            if (jsonAgencia.correcto) agencia = jsonAgencia.data;
        }

        cargarPaqueteEnUI();
        footer_header();

    } catch (e) {
        console.error("Error:", e);
        showAlert('Error', 'No se pudieron cargar los datos del paquete.');
    }
});

function cargarPaqueteEnUI() {
    try {
        editMode = false;

        // Imagen - Los paquetes pueden tener imágenes en diferentes ubicaciones
        if (paquete.imagen_url) {
            // Intentar primero en paquetes, luego en lugares como fallback
            img.src = `../../../src/media/images/paquetes/${paquete.imagen_url}`;
            img.onerror = function() {
                this.src = `../../../src/media/images/lugares/${paquete.imagen_url}`;
            };
        }
        img.alt = paquete.nombre_paquete || 'Paquete';

        // Inputs
        nameInput.value = paquete.nombre_paquete || '';
        descInput.value = paquete.descripcion_paquete || '';
        priceInput.value = paquete.precio || '';

        // Tarjetas
        actualizarTarjetaLugar();

        // Agencia
        agencyEl.textContent = agencia
            ? `Agencia: ${agencia.nombre_agencia}`
            : "Agencia desconocida";

        if (agencia?.imagen_url) {
            agencyImg.style.backgroundImage = `url(../../../src/media/images/agencias/${agencia.imagen_url})`;
        }

        // Estado inicial UI
        actualizarEstadoUI();

    } catch (error) {
        console.error("Error UI:", error);
    }
}

function actualizarTarjetaLugar() {
    placeEl.innerHTML = '';
    if (lugar) {
        placeEl.innerHTML = `<div style="display:flex; flex-direction:column; gap:4px;">
            <span>${lugar.nombre_lugar}</span>
            <small style="font-weight:400; font-size:0.8em; opacity:0.8;">${lugar.direccion || ''}</small>
        </div>`;
    } else {
        placeEl.textContent = "Seleccionar Lugar";
    }
}

function actualizarEstadoUI() {
    // Inputs
    [nameInput, descInput, priceInput, fileInput].forEach(el => el.disabled = !editMode);

    // Punteros e interactividad
    const cursorStyle = editMode ? 'pointer' : 'default';
    const borderStyle = editMode ? '2px dashed #2563eb' : 'none';

    placeEl.style.cursor = cursorStyle;
    placeEl.style.pointerEvents = editMode ? 'auto' : 'none';
    if (editMode) placeEl.style.border = borderStyle; else placeEl.style.border = '';

    img.style.cursor = cursorStyle;
    img.style.pointerEvents = editMode ? 'auto' : 'none';

    // Botones
    btnSave.disabled = !editMode;
    btnEdit.textContent = editMode ? 'Cancelar edición' : '✏ Iniciar edición';

    // Visibilidad de botones admin
    const puedeEditar = paquete.id_agencia === currentProfile?.id_agencia;
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

btnEdit.addEventListener("click", () => {
    editMode = !editMode;
    actualizarEstadoUI();

    if (!editMode) {
        fileInput.value = '';
        nuevaImagenArchivo = null;
        cargarPaqueteEnUI();
    }
});

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

placeEl.addEventListener('click', async () => {
    if (!editMode) return;
    try {
        const res = await fetch("../../data/Logic/packageAgencyController.php?accion=lugares");
        const json = await res.json();
        if (!json.correcto) return showAlert('Error', 'Falló la carga de lugares');

        const config = {
            keyNombre: 'nombre_lugar',
            keyDesc: 'descripcion',
            keyImg: 'imagen_url',
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

// =====================================================
// 6. GUARDAR Y ELIMINAR
// =====================================================

btnSave.addEventListener("click", async () => {
    try {
        if (!nameInput.value.trim()) return showAlert('Faltan datos', 'El nombre es obligatorio.');

        const formData = new FormData();

        formData.append("accion", "actualizar");
        formData.append("idPaquete", idPaquete);
        formData.append("nombre_paquete", nameInput.value);
        formData.append("descripcion_paquete", descInput.value);
        formData.append("precio", priceInput.value);

        // IDs foráneos
        formData.append("id_lugar", lugar?.id_lugar ?? paquete.id_lugar);

        if (nuevaImagenArchivo) formData.append('imagen', nuevaImagenArchivo);

        const res = await fetch("../../data/Logic/packageAgencyController.php", {
            method: "POST", body: formData
        });
        const json = await res.json();

        if (!json.correcto) return showAlert('Error', json.mensaje || 'Error al guardar');

        if (json.data) {
            paquete = json.data;
            if (json.data.lugar) lugar = json.data.lugar;
        } else {
            paquete.nombre_paquete = nameInput.value;
            paquete.descripcion_paquete = descInput.value;
            paquete.precio = priceInput.value;
            if (json.nueva_imagen_url) paquete.imagen_url = json.nueva_imagen_url;
        }

        if (paquete.imagen_url) {
            img.src = `../../../src/media/images/paquetes/${paquete.imagen_url}`;
            img.onerror = function() {
                this.src = `../../../src/media/images/lugares/${paquete.imagen_url}`;
            };
        }

        nuevaImagenArchivo = null;
        editMode = false;
        actualizarEstadoUI();

        await showAlert('Éxito', 'Paquete actualizado correctamente.');

    } catch (err) {
        console.error(err);
        showAlert('Error', 'Ocurrió un error inesperado al guardar.');
    }
});

btnDelete.addEventListener("click", async () => {
    try {
        const confirmar = await showConfirm('Eliminar', '¿Realmente deseas eliminar este paquete? No se puede deshacer.');
        if (!confirmar) return;

        const formData = new FormData();

        formData.append("idPaquete", idPaquete);
        formData.append("accion", "eliminar");

        const res = await fetch("../../data/Logic/packageAgencyController.php", {
            method: "POST",
            body: formData
        });

        const json = await res.json();

        if (!json.correcto) return showAlert('Error', json.mensaje);

        await showAlert('Eliminado', 'El paquete ha sido eliminado.');
        sessionStorage.removeItem("paquete_seleccionado");
        window.location.href = "./agency.html";
    } catch (err) {
        console.error(err);
        showAlert('Error', 'No se pudo eliminar el paquete.');
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

            const s_header = document.getElementById("s_header");
            s_header.style.backgroundImage = "url(./../../../src/media/images/layout/img_background_header.jpg)";

            document.getElementById("n_h2").innerText = paquete.nombre_paquete;
            document.getElementById("s_icon").setAttribute("src", "./../../../src/media/images/icons/icon_arc.png");
            const bnav = document.getElementById("underline_nav");

            const a1 = document.createElement("a");
            a1.id = "a1";
            a1.href = "agency.html";
            const ai1 = document.createElement("img");
            ai1.src = "./../../../src/media/images/icons/icon_home.png";
            ai1.classList.add("icon_nav");
            a1.appendChild(ai1);
            a1.append("Pagina Principal");
            bnav.appendChild(a1);

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

            document.getElementById("f_icon").src = "./../../../src/media/images/icons/icon_arc.png";

            document.querySelector(".f_link").href = "#";

            const f_general = document.getElementById("f_general");
            f_general.style.backgroundImage = "url(./../../../src/media/images/layout/imgLayout20.jpg)";
            f_general.style.backgroundPosition = "50% 80%";
        });
}

