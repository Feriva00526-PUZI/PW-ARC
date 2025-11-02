export async function crearCarrusel({
    containerSelector,
    dataFile,
    type = "paquete",
    title = "Recomendados",
    filtro = null,
    maxVisible = 5
}) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        return console.error(`No se encontró el contenedor "${containerSelector}"`);
    }

    // --- Cargar datos ---
    let baseDataPath = window.location.pathname.includes("/html/") ? "../../data/" : "./data/";
    const res = await fetch(`${baseDataPath}${dataFile}`);
    if (!res.ok) throw new Error(`Error cargando JSON: ${dataFile}`);
    let data = await res.json();
    if (!Array.isArray(data)) data = data.paquetes || data.eventos || [];
    if (filtro) data = data.filter(item => Object.entries(filtro).every(([k, v]) => item[k] === v));

    // --- Crear tarjetas ---
    const crearTarjeta = function (item) {
        let imagenes = item.imagen_url || []; //Agarra el arreglo de direcciones o vacio
        let rutaImagen, nombre, descripcion;

        if (type === "paquete") {
            rutaImagen = `../../media/images/lugares/${getRandomImage(imagenes)}`;
            nombre = item.nombre_paquete;
            descripcion = item.descripcion_paquete;
        } else {
            rutaImagen = `../../media/images/events/${getRandomImage(imagenes)}`;
            nombre = item.nombre_evento;
            descripcion = item.descripcion;
        }

        let estiloNombre = "";
        if (type === "evento" && item.fecha_evento && diasParaEvento(item.fecha_evento) <= 4)
            estiloNombre = 'style="color:red;"';

        return `
            <div class="card">
                <img src="${rutaImagen}" alt="${nombre}" onerror="this.onerror=null; this.src='../../media/images/error.jpg'; ">
                <h3 ${estiloNombre}>${nombre}</h3>
                <p>${descripcion}</p>
            </div>
        `;
    };

    // --- Crear estructura carrusel ---
    const carrusel = document.createElement("div");
    carrusel.className = "carrusel";
    carrusel.innerHTML = `
        <h2 class="carrusel-title">${title}</h2>
        <div class="carrusel-viewport">
            <div class="carrusel-container">${data.map(crearTarjeta).join('')}</div>
        </div>
        <button class="carrusel-btn carrusel-prev"><</button>
        <button class="carrusel-btn carrusel-next">></button>
        <button class="carrusel-more">Mostrar más</button>
    `;
    container.appendChild(carrusel);

    const containerEl = carrusel.querySelector(".carrusel-container");
    const btnPrev = carrusel.querySelector(".carrusel-prev");
    const btnNext = carrusel.querySelector(".carrusel-next");
    const btnMore = carrusel.querySelector(".carrusel-more");

    let page = 0;
    let rows = 1;
    const totalItems = data.length;
    let totalPages;

    // --- Calcular cantidad visible según ancho ---
    const calcularMaxVisible = function () {
        const width = window.innerWidth;
        if (width < 480) return 1;
        if (width < 768) return 2;
        if (width < 1024) return 3;
        return maxVisible; // valor maximo definido en los parámetros
    };

    // --- Actualizar estructura del grid ---
    const actualizarGrid = function () {
        maxVisible = calcularMaxVisible();
        totalPages = Math.ceil(totalItems / maxVisible);

        containerEl.style.display = "grid";
        containerEl.style.gridTemplateColumns = `repeat(${totalItems}, 1fr)`;
        containerEl.style.gridTemplateRows = `repeat(${rows}, auto)`;
        containerEl.style.transition = "transform 0.5s ease";
        containerEl.style.width = `${(totalItems / maxVisible) * 100}%`;

        if (page >= totalPages) page = totalPages - 1;
    };

    // --- Actualizar posición (Es una animacion) ---
    const actualizarPos = function () {
        const totalWidth = totalItems * (100 / maxVisible);
        const step = 100 / totalItems;
        const desplazamiento = -(page * maxVisible * step);
        containerEl.style.transform = `translateX(${desplazamiento}%)`;
    };

    // --- Inicialización ---
    actualizarGrid();
    actualizarPos();

    // --- Botones ---
    btnPrev.addEventListener("click", function () {
        const maxPage = Math.ceil(totalItems / maxVisible) - 1;
        if (page === 0) {
            page = maxPage; // si estamos al inicio, saltamos al final
        } else {
            page--;
        }
        actualizarPos();
    });

    btnNext.addEventListener("click", function () {
        const maxPage = Math.ceil(totalItems / maxVisible) - 1;
        if (page >= maxPage) {
            page = 0; // si llegamos al final, volvemos al inicio
        } else {
            page++;
        }
        actualizarPos();
    });

    // --- Botón Mostrar más ---
    btnMore.addEventListener("click", function () {
        const totalCapacidad = rows * maxVisible;
        if (totalCapacidad >= totalItems) {
            btnMore.disabled = true;
            btnMore.textContent = "No hay más elementos";
            btnMore.style.background = "#999";
            return;
        }

        rows++;
        actualizarGrid();

        if (rows * maxVisible >= totalItems) {
            btnMore.disabled = true;
            btnMore.textContent = "No hay más elementos";
            btnMore.style.background = "#999";
        }
    });

    // --- Para actualizar el contenido en funcion del tamaño ---
    window.addEventListener("resize", function () {
        const oldVisible = maxVisible;
        actualizarGrid();
        if (oldVisible !== maxVisible) page = 0;
        actualizarPos();
    });
}

// --- Funciones auxiliares ---
function getRandomImage(imagenes) { // Funcion para elegir una imagen aleatoria de un evento o paquete.
    if (Array.isArray(imagenes)) {
        return imagenes[Math.floor(Math.random() * imagenes.length)];
    }
    return imagenes;
}

function diasParaEvento(fechaEvento) {
    const hoy = new Date();
    const fecha = new Date(fechaEvento);
    return Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
}
