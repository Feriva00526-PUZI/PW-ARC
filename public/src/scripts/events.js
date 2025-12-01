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
    configurarInputsAyuda();
    configurarOverlayImagen();

    if (!editMode) {
        // Cancelar: Recargar todo para perder cambios no guardados
        fileInput.value = '';
        nuevaImagenArchivo = null;
        eliminarOverlayImagen();
        eliminarTooltips();
        cargarEventoEnUI();
    }
});

function configurarInputsAyuda() {
    
    // Función auxiliar que crea un "wrapper" (envoltorio) alrededor del input
    const addTooltipWrapper = (element, text) => {
        if (!element) return;
        
        // 1. Evitamos volver a envolver si ya lo hicimos
        if (element.parentElement.classList.contains('tooltip-container')) {
            element.parentElement.setAttribute('data-tooltip', text);
            return;
        }

        // 2. Creamos el contenedor
        const wrapper = document.createElement('div');
        wrapper.className = 'tooltip-container';
        wrapper.setAttribute('data-tooltip', text);
        
        // 3. Insertamos el contenedor antes del input
        element.parentNode.insertBefore(wrapper, element);
        
        // 4. Movemos el input ADENTRO del contenedor
        wrapper.appendChild(element);
        
        // 5. Limpieza visual
        element.removeAttribute("title");
        // Aseguramos que el input ocupe el 100% de su nuevo contenedor
        element.style.width = "100%"; 
    };

    // --- CONFIGURACIÓN DE LOS MENSAJES ---

    // 1. Nombre del Evento
    nameInput.placeholder = "Ej: Concierto de Rock en la Plaza";
    addTooltipWrapper(nameInput, "El nombre debe ser corto y llamativo para atraer atención.");
    
    // 2. Descripción
    descInput.placeholder = "Describe los detalles, artistas invitados...";
    addTooltipWrapper(descInput, "Incluye detalles clave: Artistas, reglas de acceso, etc.");
    
    // 3. Precio
    priceInput.placeholder = "0 - 3000";
    priceInput.min = "0";
    priceInput.max = "3000";
    addTooltipWrapper(priceInput, "Costo en MXN. Escribe 0 si es entrada libre.");

    
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
    // 1. Buscamos todos los contenedores de tooltips que creamos
    const wrappers = document.querySelectorAll('.tooltip-container');

    wrappers.forEach(wrapper => {
        // 2. Buscamos el input (o textarea/select) que está dentro
        const input = wrapper.querySelector('input, textarea, select');

        if (input) {
            // 3. Movemos el input FUERA del wrapper (lo insertamos antes del wrapper)
            // Esto lo devuelve a su posición original en el DOM
            wrapper.parentNode.insertBefore(input, wrapper);

            // 4. Limpiamos el estilo inline que añadimos (width: 100%)
            // para que recupere su tamaño definido por CSS original
            input.style.width = ''; 
            
            // Opcional: Si quieres restaurar el 'title' original (aunque suele ser redundante)
            // input.title = wrapper.getAttribute('data-tooltip'); 
        }

        // 5. Eliminamos el wrapper (y con él, el tooltip visual)
        wrapper.remove();
    });
}

function eliminarOverlayImagen() {
    // 1. Buscamos el wrapper de la imagen
    const wrapper = document.querySelector('.img-wrapper-event');
    
    if (wrapper) {
        // 2. Buscamos la imagen original dentro
        const img = wrapper.querySelector('img');
        
        if (img) {
            // 3. Sacamos la imagen del wrapper
            wrapper.parentNode.insertBefore(img, wrapper);
        }
        
        // 4. Eliminamos el wrapper (esto elimina también el div .img-hover-overlay)
        wrapper.remove();
    }
}

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