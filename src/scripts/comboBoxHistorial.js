// Variable global para almacenar todos los datos de viajes
let todosLosViajes = [];

/**
 * Inicializa el combo box de lugares y carga los lugares desde la base de datos
 */
function initComboBoxLugares() {
  console.log("Inicializando combo box de lugares..."); // Debug
  const cbLugares = document.getElementById("cbLugares");
  
  if (!cbLugares) {
    console.error("No se encontró el elemento cbLugares. Intentando de nuevo en 100ms...");
    // Reintentar después de un breve delay por si el DOM aún no está listo
    setTimeout(() => {
      initComboBoxLugares();
    }, 100);
    return;
  }
  
  console.log("Elemento cbLugares encontrado, cargando lugares..."); // Debug

  // Cargar lugares desde la base de datos
  fetch("../../data/logic/lugarLogic.php")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Datos recibidos de lugarLogic:", data); // Debug
      if (data.correcto && data.lugares) {
        // Limpiar opciones existentes (excepto "Todos los lugares")
        cbLugares.innerHTML = '<option value="">Todos los lugares</option>';
        
        // Agregar cada lugar al combo box
        data.lugares.forEach(lugar => {
          const option = document.createElement("option");
          option.value = lugar.nombre_lugar;
          option.textContent = lugar.nombre_lugar;
          cbLugares.appendChild(option);
        });
        console.log(`Se agregaron ${data.lugares.length} lugares al combo box`); // Debug
      } else {
        console.error("Error al cargar lugares:", data.mensaje || "Error desconocido", data);
      }
    })
    .catch(err => {
      console.error("Error en la petición de lugares:", err);
    });

  // Agregar evento de cambio para filtrar la tabla
  cbLugares.addEventListener("change", function() {
    filtrarTablaPorLugar(this.value);
  });
}

/**
 * Filtra la tabla de viajes por el lugar seleccionado
 * @param {string} nombreLugar - Nombre del lugar seleccionado (vacío para mostrar todos)
 */
function filtrarTablaPorLugar(nombreLugar) {
  if (!window.initHistorialTable) {
    console.error("initHistorialTable no está disponible");
    return;
  }

  let viajesFiltrados = todosLosViajes;

  // Si se seleccionó un lugar específico, filtrar
  if (nombreLugar && nombreLugar !== "") {
    viajesFiltrados = todosLosViajes.filter(viaje => 
      viaje.nombre_lugar === nombreLugar
    );
  }

  // Re-renderizar la tabla con los datos filtrados
  window.initHistorialTable(viajesFiltrados);
}

/**
 * Establece los datos de viajes para poder filtrarlos
 * @param {Array} viajes - Array con todos los viajes
 */
function setDatosViajes(viajes) {
  todosLosViajes = viajes || [];
}

// Exportar funciones para uso global
window.initComboBoxLugares = initComboBoxLugares;
window.filtrarTablaPorLugar = filtrarTablaPorLugar;
window.setDatosViajes = setDatosViajes;

