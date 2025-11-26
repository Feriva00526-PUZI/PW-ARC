// Variable global para almacenar todos los datos de viajes
let todosLosViajes = [];

/**
 * Extrae los lugares únicos de los viajes cargados
 * @returns {Array} Array con los nombres de lugares únicos
 */
function extraerLugaresUnicos() {
  if (!todosLosViajes || todosLosViajes.length === 0) {
    return [];
  }

  // Obtener todos los nombres de lugares únicos
  const lugaresUnicos = [...new Set(todosLosViajes.map(viaje => viaje.nombre_lugar))];
  
  // Ordenar alfabéticamente
  lugaresUnicos.sort();
  
  return lugaresUnicos;
}

/**
 * Inicializa el combo box de lugares con los lugares de los viajes cargados
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
  
  console.log("Elemento cbLugares encontrado, extrayendo lugares de viajes..."); // Debug

  // Extraer lugares únicos de los viajes ya cargados
  const lugaresUnicos = extraerLugaresUnicos();
  
  if (lugaresUnicos.length === 0) {
    console.warn("No se encontraron lugares en los viajes. El combo box se llenará cuando se carguen los viajes.");
    // Agregar evento de cambio para filtrar la tabla
    cbLugares.addEventListener("change", function() {
      filtrarTablaPorLugar(this.value);
    });
    return;
  }

  // Limpiar opciones existentes (excepto "Todos los lugares")
  cbLugares.innerHTML = '<option value="">Todos los lugares</option>';
  
  // Agregar cada lugar único al combo box
  lugaresUnicos.forEach(nombreLugar => {
    const option = document.createElement("option");
    option.value = nombreLugar;
    option.textContent = nombreLugar;
    cbLugares.appendChild(option);
  });
  
  console.log(`Se agregaron ${lugaresUnicos.length} lugares únicos al combo box`); // Debug

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
    viajesFiltrados = todosLosViajes.filter(lugar => 
      lugar.nombre_lugar === nombreLugar
    );
  }

  // Re-renderizar la tabla con los datos filtrados
  window.initHistorialTable(viajesFiltrados);
}

/**
 * Establece los datos de viajes para poder filtrarlos y actualiza el combo box
 * @param {Array} viajes - Array con todos los viajes
 */
function setDatosViajes(viajes) {
  todosLosViajes = viajes || [];
  
  // Si el combo box ya existe, actualizarlo con los nuevos lugares
  const cbLugares = document.getElementById("cbLugares");
  if (cbLugares && todosLosViajes.length > 0) {
    const lugaresUnicos = extraerLugaresUnicos();
    
    // Limpiar opciones existentes (excepto "Todos los lugares")
    cbLugares.innerHTML = '<option value="">Todos los lugares</option>';
    
    // Agregar cada lugar único al combo box
    lugaresUnicos.forEach(nombreLugar => {
      const option = document.createElement("option");
      option.value = nombreLugar;
      option.textContent = nombreLugar;
      cbLugares.appendChild(option);
    });
    
    console.log(`Combo box actualizado con ${lugaresUnicos.length} lugares únicos`); // Debug
  }
}

// Exportar funciones para uso global
window.initComboBoxLugares = initComboBoxLugares;
window.filtrarTablaPorLugar = filtrarTablaPorLugar;
window.setDatosViajes = setDatosViajes;

