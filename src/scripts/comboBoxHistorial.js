// ============================================
// MÓDULO DE FILTRADO DE HISTORIAL
// Maneja los combobox de filtrado (Lugar, Ciudad, Zona)
// ============================================

// Variables para almacenar datos maestros (se inicializan desde script_usuario_historial.js)
let datosViajesMaestro = [];
let datosReservacionesMaestro = [];
let datosCombinados = [];

// Función para inicializar los datos maestros (llamada desde script_usuario_historial.js)
function inicializarDatosHistorial(viajes, reservaciones) {
  datosViajesMaestro = viajes || [];
  datosReservacionesMaestro = reservaciones || [];
  datosCombinados = [...datosViajesMaestro, ...datosReservacionesMaestro];
  
  console.log("Datos inicializados:", {
    viajes: datosViajesMaestro.length,
    reservaciones: datosReservacionesMaestro.length,
    combinados: datosCombinados.length
  });
}

// Función para obtener valores únicos de un campo
function obtenerValoresUnicos(datos, campo) {
  const valores = new Set();
  datos.forEach(item => {
    if (item[campo]) {
      valores.add(item[campo]);
    }
  });
  return Array.from(valores).sort();
}

// Función para llenar los combobox con valores únicos
function llenarCombobox() {
  console.log("Llenando combobox...");
  
  // Combinar datos de viajes y reservaciones para obtener todos los lugares únicos
  datosCombinados = [...datosViajesMaestro, ...datosReservacionesMaestro];
  
  // Obtener valores únicos
  const nombresUnicos = obtenerValoresUnicos(datosCombinados, 'nombre_lugar');
  const ciudadesUnicas = obtenerValoresUnicos(datosCombinados, 'ciudad');
  const zonasUnicas = obtenerValoresUnicos(datosCombinados, 'zona');

  console.log("Valores únicos encontrados:", {
    nombres: nombresUnicos.length,
    ciudades: ciudadesUnicas.length,
    zonas: zonasUnicas.length
  });

  // Llenar combobox de Nombre (Lugar)
  const cbNombre = document.getElementById('cbNombre');
  if (cbNombre) {
    cbNombre.innerHTML = '<option value="todos">Todos</option>';
    if (nombresUnicos.length > 0) {
      nombresUnicos.forEach(nombre => {
        const option = document.createElement('option');
        option.value = nombre;
        option.textContent = nombre;
        cbNombre.appendChild(option);
      });
      console.log("Combobox Nombre llenado con", nombresUnicos.length, "opciones");
    } else {
      console.warn("No se encontraron nombres únicos");
    }
  } else {
    console.error("No se encontró el elemento cbNombre");
  }

  // Llenar combobox de Ciudad
  const cbCiudad = document.getElementById('cbCiudad');
  if (cbCiudad) {
    cbCiudad.innerHTML = '<option value="todos">Todos</option>';
    if (ciudadesUnicas.length > 0) {
      ciudadesUnicas.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad;
        option.textContent = ciudad;
        cbCiudad.appendChild(option);
      });
      console.log("Combobox Ciudad llenado con", ciudadesUnicas.length, "opciones");
    } else {
      console.warn("No se encontraron ciudades únicas");
    }
  } else {
    console.error("No se encontró el elemento cbCiudad");
  }

  // Llenar combobox de Zona
  const cbZona = document.getElementById('cbZona');
  if (cbZona) {
    cbZona.innerHTML = '<option value="todos">Todos</option>';
    if (zonasUnicas.length > 0) {
      zonasUnicas.forEach(zona => {
        const option = document.createElement('option');
        option.value = zona;
        option.textContent = zona;
        cbZona.appendChild(option);
      });
      console.log("Combobox Zona llenado con", zonasUnicas.length, "opciones");
    } else {
      console.warn("No se encontraron zonas únicas. Verificar que los DAOs incluyan el campo 'zona'");
    }
  } else {
    console.error("No se encontró el elemento cbZona");
  }
}

// Función para actualizar combobox dependientes
function actualizarComboboxDependientes(comboboxCambiado) {
  const nombreSeleccionado = document.getElementById('cbNombre').value;
  const ciudadSeleccionada = document.getElementById('cbCiudad').value;
  const zonaSeleccionada = document.getElementById('cbZona').value;

  // Filtrar datos según selecciones actuales
  let datosFiltrados = datosCombinados;

  if (nombreSeleccionado !== 'todos') {
    datosFiltrados = datosFiltrados.filter(item => item.nombre_lugar === nombreSeleccionado);
  }
  if (ciudadSeleccionada !== 'todos') {
    datosFiltrados = datosFiltrados.filter(item => item.ciudad === ciudadSeleccionada);
  }
  if (zonaSeleccionada !== 'todos') {
    datosFiltrados = datosFiltrados.filter(item => item.zona === zonaSeleccionada);
  }

  // Actualizar combobox según cuál cambió
  if (comboboxCambiado === 'cbNombre') {
    // Actualizar Ciudad y Zona
    const ciudadesDisponibles = obtenerValoresUnicos(datosFiltrados, 'ciudad');
    const zonasDisponibles = obtenerValoresUnicos(datosFiltrados, 'zona');

    const cbCiudad = document.getElementById('cbCiudad');
    const ciudadActual = cbCiudad.value;
    cbCiudad.innerHTML = '<option value="todos">Todos</option>';
    ciudadesDisponibles.forEach(ciudad => {
      const option = document.createElement('option');
      option.value = ciudad;
      option.textContent = ciudad;
      if (ciudad === ciudadActual && ciudadActual !== 'todos') {
        option.selected = true;
      }
      cbCiudad.appendChild(option);
    });
    if (!ciudadesDisponibles.includes(ciudadActual) && ciudadActual !== 'todos') {
      cbCiudad.value = 'todos';
    }

    const cbZona = document.getElementById('cbZona');
    const zonaActual = cbZona.value;
    cbZona.innerHTML = '<option value="todos">Todos</option>';
    zonasDisponibles.forEach(zona => {
      const option = document.createElement('option');
      option.value = zona;
      option.textContent = zona;
      if (zona === zonaActual && zonaActual !== 'todos') {
        option.selected = true;
      }
      cbZona.appendChild(option);
    });
    if (!zonasDisponibles.includes(zonaActual) && zonaActual !== 'todos') {
      cbZona.value = 'todos';
    }
  } else if (comboboxCambiado === 'cbCiudad') {
    // Actualizar Nombre y Zona
    const nombresDisponibles = obtenerValoresUnicos(datosFiltrados, 'nombre_lugar');
    const zonasDisponibles = obtenerValoresUnicos(datosFiltrados, 'zona');

    const cbNombre = document.getElementById('cbNombre');
    const nombreActual = cbNombre.value;
    cbNombre.innerHTML = '<option value="todos">Todos</option>';
    nombresDisponibles.forEach(nombre => {
      const option = document.createElement('option');
      option.value = nombre;
      option.textContent = nombre;
      if (nombre === nombreActual && nombreActual !== 'todos') {
        option.selected = true;
      }
      cbNombre.appendChild(option);
    });
    if (!nombresDisponibles.includes(nombreActual) && nombreActual !== 'todos') {
      cbNombre.value = 'todos';
    }

    const cbZona = document.getElementById('cbZona');
    const zonaActual = cbZona.value;
    cbZona.innerHTML = '<option value="todos">Todos</option>';
    zonasDisponibles.forEach(zona => {
      const option = document.createElement('option');
      option.value = zona;
      option.textContent = zona;
      if (zona === zonaActual && zonaActual !== 'todos') {
        option.selected = true;
      }
      cbZona.appendChild(option);
    });
    if (!zonasDisponibles.includes(zonaActual) && zonaActual !== 'todos') {
      cbZona.value = 'todos';
    }
  } else if (comboboxCambiado === 'cbZona') {
    // Actualizar Nombre y Ciudad
    const nombresDisponibles = obtenerValoresUnicos(datosFiltrados, 'nombre_lugar');
    const ciudadesDisponibles = obtenerValoresUnicos(datosFiltrados, 'ciudad');

    const cbNombre = document.getElementById('cbNombre');
    const nombreActual = cbNombre.value;
    cbNombre.innerHTML = '<option value="todos">Todos</option>';
    nombresDisponibles.forEach(nombre => {
      const option = document.createElement('option');
      option.value = nombre;
      option.textContent = nombre;
      if (nombre === nombreActual && nombreActual !== 'todos') {
        option.selected = true;
      }
      cbNombre.appendChild(option);
    });
    if (!nombresDisponibles.includes(nombreActual) && nombreActual !== 'todos') {
      cbNombre.value = 'todos';
    }

    const cbCiudad = document.getElementById('cbCiudad');
    const ciudadActual = cbCiudad.value;
    cbCiudad.innerHTML = '<option value="todos">Todos</option>';
    ciudadesDisponibles.forEach(ciudad => {
      const option = document.createElement('option');
      option.value = ciudad;
      option.textContent = ciudad;
      if (ciudad === ciudadActual && ciudadActual !== 'todos') {
        option.selected = true;
      }
      cbCiudad.appendChild(option);
    });
    if (!ciudadesDisponibles.includes(ciudadActual) && ciudadActual !== 'todos') {
      cbCiudad.value = 'todos';
    }
  }
}

// Función para aplicar filtros a los datos
function aplicarFiltros() {
  const nombreSeleccionado = document.getElementById('cbNombre').value;
  const ciudadSeleccionada = document.getElementById('cbCiudad').value;
  const zonaSeleccionada = document.getElementById('cbZona').value;

  // Filtrar viajes
  let viajesFiltrados = datosViajesMaestro.filter(item => {
    const matchNombre = nombreSeleccionado === 'todos' || item.nombre_lugar === nombreSeleccionado;
    const matchCiudad = ciudadSeleccionada === 'todos' || item.ciudad === ciudadSeleccionada;
    const matchZona = zonaSeleccionada === 'todos' || item.zona === zonaSeleccionada;
    return matchNombre && matchCiudad && matchZona;
  });

  // Filtrar reservaciones
  let reservacionesFiltradas = datosReservacionesMaestro.filter(item => {
    const matchNombre = nombreSeleccionado === 'todos' || item.nombre_lugar === nombreSeleccionado;
    const matchCiudad = ciudadSeleccionada === 'todos' || item.ciudad === ciudadSeleccionada;
    const matchZona = zonaSeleccionada === 'todos' || item.zona === zonaSeleccionada;
    return matchNombre && matchCiudad && matchZona;
  });

  // Re-renderizar tablas con datos filtrados
  if (typeof window.initHistorialTable === "function") {
    window.initHistorialTable(viajesFiltrados);
  }
  if (typeof window.initReservacionesTable === "function") {
    window.initReservacionesTable(reservacionesFiltradas);
  }
}

// Función para configurar los event listeners de los combobox
function configurarEventListenersCombobox() {
  const cbNombre = document.getElementById('cbNombre');
  const cbCiudad = document.getElementById('cbCiudad');
  const cbZona = document.getElementById('cbZona');

  if (cbNombre) {
    cbNombre.addEventListener('change', () => {
      actualizarComboboxDependientes('cbNombre');
      aplicarFiltros();
    });
  }

  if (cbCiudad) {
    cbCiudad.addEventListener('change', () => {
      actualizarComboboxDependientes('cbCiudad');
      aplicarFiltros();
    });
  }

  if (cbZona) {
    cbZona.addEventListener('change', () => {
      actualizarComboboxDependientes('cbZona');
      aplicarFiltros();
    });
  }
}

// Función principal de inicialización (llamada desde script_usuario_historial.js)
function inicializarFiltrosHistorial() {
  // Llenar combobox con todos los valores únicos
  llenarCombobox();
  
  // Configurar event listeners
  configurarEventListenersCombobox();
  
  console.log("Filtros de historial inicializados correctamente");
}

// Exportar funciones para uso global
window.inicializarDatosHistorial = inicializarDatosHistorial;
window.inicializarFiltrosHistorial = inicializarFiltrosHistorial;

