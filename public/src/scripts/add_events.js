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
const capacityInput = document.getElementById("event-capacity"); 

// Tarjetas interactivas
const placeEl = document.getElementById("event-place");
const typeEl = document.getElementById("event-type");
const organizerEl = document.getElementById("event-organizer");
const organizerImg = document.getElementById("event-organizer-img");
const btnCalendar = document.getElementById("event-calendar");

// Botones de acción
const btnEdit = document.getElementById("btn-edit"); 
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete"); 

// Estado Global
let lugarSeleccionado = null;
let tipoActividadSeleccionado = null;
let nuevaImagenArchivo = null;
let organizador = JSON.parse(sessionStorage.getItem("organizador_logeado")) || null;


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

        if (btnEdit) btnEdit.style.display = "none";
        if (btnDelete) btnDelete.style.display = "none";

        if (organizador) {
            organizerEl.textContent = `Organizado por: ${organizador.nombre_agencia}`;
            if (organizador.image_url) {
                organizerImg.style.backgroundImage = `url(../../../src/media/images/organizers/${organizador.image_url})`;
            }
        } else {
            organizerEl.textContent = "Organizador (No logueado)";
        }

        configurarInputsAyuda();
        configurarOverlayImagen();
        
        inicializarFormularioCreacion();

    } catch (e) {
        console.error("Error al iniciar:", e);
        showAlert("Error", "No se pudo iniciar el formulario.");
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

    // 4. Cantidad de Boletos
    if(capacityInput.tagName === 'INPUT') {
        capacityInput.placeholder = "10 - 1000";
        addTooltipWrapper(capacityInput, "Aforo permitido: Mínimo 10, Máximo 1000 personas.");
        
        // Lógica de validación (se mantiene igual)
        capacityInput.addEventListener('input', function() {
            const val = parseInt(this.value);
            if(val < 10 || val > 1000) this.setCustomValidity("Entre 10 y 1000.");
            else this.setCustomValidity("");
        });
    }
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

function inicializarFormularioCreacion() {
    // Habilitar todos los inputs 
    [nameInput, descInput, timeInput, priceInput, fileInput, capacityInput].forEach(el => el.disabled = false);
    btnSave.disabled = false;
    btnSave.textContent = "Crear Evento";

    placeEl.style.cursor = 'pointer';
    placeEl.style.border = '2px dashed #2563eb';

    typeEl.style.cursor = 'pointer';
    typeEl.style.border = '2px dashed #2563eb';

    img.style.cursor = 'pointer'; 
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


// =====================================================
// 5. INTERACCIONES
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

btnCalendar.addEventListener("click", () => {
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

        // [NUEVO] Validación de cantidad de boletos
        const cantidadBoletos = parseInt(capacityInput.value || 0);
        if (isNaN(cantidadBoletos) || cantidadBoletos < 10 || cantidadBoletos > 1000) {
            return showAlert('Datos Inválidos', 'El número de boletos debe ser entre 10 y 1000.');
        }

        if (!window.calendarState.selectedDay) {
            return showAlert('Fecha Requerida', 'No has seleccionado una fecha. Por favor abre el calendario y elige un día.');
        }

        const fecha = new Date(window.calendarState.selectedDay.year, window.calendarState.selectedDay.month - 1, window.calendarState.selectedDay.day); 
        const fechaFormateada = fecha.toISOString().split('T')[0];

        // --- PREPARAR FORMDATA ---
        const formData = new FormData();
        formData.append("accion", "crear");
        formData.append("nombre_evento", nameInput.value);
        formData.append("descripcion", descInput.value);
        formData.append("hora_evento", timeInput.value);
        formData.append("precio_boleto", priceInput.value || 0);
        
        // [NUEVO] Enviamos la capacidad (Asegúrate de que tu PHP reciba 'capacidad')
        formData.append("capacidad", cantidadBoletos);

        formData.append("fecha_evento", fechaFormateada);
        formData.append("id_lugar", lugarSeleccionado.id_lugar);
        formData.append("id_tipo_actividad", tipoActividadSeleccionado.id_tipo_actividad);

        if (organizador && organizador.id_organizadora) {
            formData.append("id_organizador", organizador.id_organizadora);
        }

        if (nuevaImagenArchivo) {
            formData.append('imagen', nuevaImagenArchivo);
        } else {
            return showAlert('Imagen requerida', 'Debes subir una imagen para el evento.');
        }

        // --- ENVIAR AL SERVIDOR ---
        const res = await fetch("../../data/Logic/eventController.php", {
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
            return showAlert('Error del Servidor', json.mensaje || 'No se pudo crear el evento.');
        }

        await showAlert('Éxito', '¡El evento ha sido creado correctamente!');
        window.location.href = "./organizers.html";

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