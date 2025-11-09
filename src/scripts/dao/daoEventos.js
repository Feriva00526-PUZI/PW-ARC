// /src/js/daoEventos.js
export async function obtenerEventosPorOrganizadora(idOrganizadora) {
  try {
    const response = await fetch("/src/data/eventos.json");
    if (!response.ok) throw new Error("Error al cargar los eventos");

    const data = await response.json();
    return data.filter(ev => ev.id_organizadora === idOrganizadora);
  } catch (error) {
    console.error("Error en DAO de eventos:", error);
    return [];
  }
}

// Funcion para contar eventos de este mes
export async function obtenerNumeroEventosEsteMes(idOrganizadora) {
  try {
    const eventos = await obtenerEventosPorOrganizadora(idOrganizadora);
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth(); // 0-11
    const anioActual = fechaActual.getFullYear();

    const eventosEsteMes = eventos.filter(ev => {
      const fechaEvento = new Date(ev.fecha_evento);
      return fechaEvento.getFullYear() === anioActual && fechaEvento.getMonth() === mesActual;
    });

    return eventosEsteMes.length;
  } catch (error) {
    console.error("Error al contar eventos de este mes:", error);
    return 0;
  }
}

export async function obtenerLugarporID(idLugar) {
  try {
    const response = await fetch("/src/data/lugares.json");
    if (!response.ok) throw new Error("Error al cargar los lugares");

    const data = await response.json();
    return data.filter(ev => ev.id_lugar === idLugar);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function obtenerTipoActividadPorID(idTipoActividad) {
  try {
    const response = await fetch("/src/data/tipoActividad.json");
    if (!response.ok) throw new Error("Error al cargar el tipo de actividad");

    const data = await response.json();
    return data.filter(ev => ev.id_tipo_actividad === idTipoActividad);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function obtenerEventoPorID(idEvento) {
  try {
    const response = await fetch("/src/data/eventos.json");
    if (!response.ok) throw new Error("Error al cargar el evento");

    
    const data = await response.json();
    return data.find(ev => ev.id_evento === idEvento);
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function obtenerOrganizadorPorID(idOrganizadora) {
  try {
    const response = await fetch("/src/data/organizers.json");
    if (!response.ok) throw new Error("Error al cargar el organizador");

    const data = await response.json();
    return data.find(ev => ev.id_organizadora === idOrganizadora);
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function obtenerTodosLugares() {
  try {
    const response = await fetch("/src/data/lugares.json");
    if (!response.ok) throw new Error("Error al cargar lugares");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function obtenerTodosTiposActividad() {
  try {
    const response = await fetch("/src/data/tipoActividad.json");
    if (!response.ok) throw new Error("Error al cargar tipos de actividades");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
