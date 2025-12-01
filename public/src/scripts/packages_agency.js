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
    configurarInputsAyuda();
    configurarOverlayImagen();
    actualizarEstadoUI();

    if (!editMode) {
        fileInput.value = '';
        eliminarTooltips();
        eliminarOverlayImagen();
        nuevaImagenArchivo = null;
        cargarPaqueteEnUI();
    }
});

function configurarInputsAyuda() {
    
    // Función auxiliar que crea un "wrapper" (envoltorio) alrededor del input
    const addTooltipWrapper = (element, text) => {
        if (!element) return;
        
        if (element.parentElement.classList.contains('tooltip-container')) {
            element.parentElement.setAttribute('data-tooltip', text);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'tooltip-container';
        wrapper.setAttribute('data-tooltip', text);
        
        element.parentNode.insertBefore(wrapper, element);
        
        wrapper.appendChild(element);
        
        element.removeAttribute("title");
        element.style.width = "100%"; 
    };

    // 1. Nombre del Evento
    nameInput.placeholder = "Ej: Viaje a Mazatlan.";
    addTooltipWrapper(nameInput, "El nombre debe ser corto y llamativo para atraer atención.");
    
    // 2. Descripción
    descInput.placeholder = "Describe los detalles...";
    addTooltipWrapper(descInput, "Incluye detalles clave: ubicación, facilidades, etc.");
    
    // 3. Precio
    priceInput.placeholder = "0 - 3000";
    priceInput.min = "0";
    priceInput.max = "3000";
    addTooltipWrapper(priceInput, "Costo en MXN.");

}

// Función para el Overlay de la imagen (Hover)
function configurarOverlayImagen() {
    // Verificamos si ya tiene wrapper para no duplicar
    if (img.parentElement.classList.contains('img-wrapper-event')) return;

    // Crear wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'img-wrapper-event';
    
    // Insertar wrapper antes de la imagen y mover imagen adentro
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'img-hover-overlay';
    overlay.innerText = "(De click para seleccionar la imagen)";
    
    // Insertar overlay
    wrapper.appendChild(overlay);

    // Al hacer click en el wrapper, disparar click en la imagen
    wrapper.addEventListener('click', (e) => {
        // Evitamos bucle si el click fue directamente en la imagen
        if(e.target !== img) img.click();
    });
}

function eliminarTooltips() {
    // Buscamos todos los contenedores creados
    const containers = document.querySelectorAll('.tooltip-container');

    containers.forEach(container => {
        // Obtenemos el input que está dentro
        // Usamos firstElementChild porque el input es el único hijo elemento real
        const input = container.firstElementChild; 

        if (input) {
            // 1. Revertimos el estilo inline de ancho
            input.style.width = ''; 

            // 2. Sacamos el input del contenedor y lo ponemos donde estaba el contenedor
            container.parentNode.insertBefore(input, container);
        }

        // 3. Eliminamos el contenedor (y el tooltip asociado)
        container.remove();
    });
}

function eliminarOverlayImagen() {
    // Buscamos el wrapper específico
    const wrapper = document.querySelector('.img-wrapper-event');

    if (wrapper) {
        // Buscamos la etiqueta img dentro del wrapper
        const imagenOriginal = wrapper.querySelector('img');

        if (imagenOriginal) {
            // 1. Sacamos la imagen y la ponemos antes del wrapper (su lugar original)
            wrapper.parentNode.insertBefore(imagenOriginal, wrapper);
        }

        // 2. Eliminamos el wrapper (esto mata también al div .img-hover-overlay)
        wrapper.remove();
    }
}

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

