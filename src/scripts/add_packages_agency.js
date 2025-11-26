// =====================================================
// 1. CONFIGURACIÓN INICIAL Y REFERENCIAS
// =====================================================

// Limpiamos cualquier rastro de selección previa
sessionStorage.removeItem("paquete_seleccionado");

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

// Botones de acción
const btnSave = document.getElementById("btn-save");

// Estado Global
let lugarSeleccionado = null;
let nuevaImagenArchivo = null;
let agencia = JSON.parse(sessionStorage.getItem("agencia_logeado")) || null;

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
// 4. LÓGICA DE INICIO
// =====================================================
window.addEventListener("load", async function () {
    try {
        footer_header();

        // Prellenar datos de la agencia logueada
        if (agencia) {
            agencyEl.textContent = `Agencia: ${agencia.nombre_agencia}`;
            if (agencia.imagen_url) {
                agencyImg.style.backgroundImage = `url(../../../src/media/images/organizers/${agencia.imagen_url})`;
            }
        } else {
            agencyEl.textContent = "Agencia (No logueada)";
        }

        inicializarFormularioCreacion();

    } catch (e) {
        console.error("Error al iniciar:", e);
        showAlert("Error", "No se pudo iniciar el formulario.");
    }
});

function inicializarFormularioCreacion() {
    [nameInput, descInput, priceInput, fileInput].forEach(el => el.disabled = false);
    btnSave.disabled = false;
    btnSave.textContent = "Crear Paquete";

    placeEl.style.cursor = 'pointer';
    placeEl.style.border = '2px dashed #2563eb';

    img.style.cursor = 'pointer';

    actualizarTarjetaLugar();
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

// =====================================================
// 5. INTERACCIONES
// =====================================================

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

placeEl.addEventListener('click', async () => {
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
            lugarSeleccionado = sel;
            actualizarTarjetaLugar();
        });
    } catch (err) {
        console.error(err);
        showAlert('Error', 'Error de conexión al obtener lugares.');
    }
});

// =====================================================
// 6. GUARDAR (CREAR) PAQUETE
// =====================================================

btnSave.addEventListener("click", async () => {
    try {
        // Validaciones
        if (!nameInput.value.trim()) return showAlert('Faltan datos', 'El nombre del paquete es obligatorio.');
        if (!priceInput.value || parseFloat(priceInput.value) <= 0) return showAlert('Faltan datos', 'El precio debe ser mayor a 0.');
        if (!lugarSeleccionado) return showAlert('Faltan datos', 'Debes seleccionar un Lugar.');

        // Preparar FormData
        const formData = new FormData();
        formData.append("accion", "crear");
        formData.append("nombre_paquete", nameInput.value);
        formData.append("descripcion_paquete", descInput.value);
        formData.append("precio", priceInput.value);
        formData.append("id_lugar", lugarSeleccionado.id_lugar);

        if (agencia && agencia.id_agencia) {
            formData.append("id_agencia", agencia.id_agencia);
        }

        // Imagen
        if (nuevaImagenArchivo) {
            formData.append('imagen', nuevaImagenArchivo);
        } else {
            return showAlert('Imagen requerida', 'Debes subir una imagen para el paquete.');
        }

        // Enviar al servidor
        const res = await fetch("../../data/Logic/packageAgencyController.php", {
            method: "POST", body: formData
        });

        const text = await res.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            console.error("Respuesta no JSON:", text);
            throw new Error("El servidor devolvió una respuesta inválida.");
        }

        if (!json.correcto) {
            return showAlert('Error del Servidor', json.mensaje || 'No se pudo crear el paquete.');
        }

        await showAlert('Éxito', '¡El paquete ha sido creado correctamente!');
        window.location.href = "./agency.html";

    } catch (err) {
        console.error(err);
        showAlert('Error Inesperado', 'Ocurrió un error al intentar guardar el paquete.');
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

            if (document.getElementById("n_h2")) document.getElementById("n_h2").innerText = "Crear nuevo paquete";
            if (document.getElementById("s_icon")) document.getElementById("s_icon").setAttribute("src", "./../../../src/media/images/icons/icon_arc.png");
            
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

