function getStatusClass(status) {
  const s = (status || "").toLowerCase();

  if (s === "pendiente") return "status-en-espera badge";
  if (s === "cancelado") return "status-cancelado badge";
  if (s === "completado") return "status-realizado badge";

  return "status-en-espera badge";
}

// Variables globales para mantener el contexto del item actual
let currentReservacionItem = null;
let currentReservacionDivEstado = null;
let currentReservacionBtnCancelar = null;

function initReservacionesTable(data) {
  console.log("initReservacionesTable - datos recibidos:", data);
  const tbody = document.querySelector("#reservaciones-table-sample tbody");
  if (!tbody) {
    console.error("No se encontró tbody para reservaciones");
    return;
  }
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    console.log("No hay datos de reservaciones");
    return;
  }

  data.forEach(item => {
    const tr = document.createElement("tr");
    const estadoReservacion = (item.estado_reservacion || "").toLowerCase();

    // id de la reservación
    const tdId = document.createElement("td");
    tdId.textContent = item.id_reservacion;

    // Evento y Lugar
    const tdEvento = document.createElement("td");
    tdEvento.textContent = item.nombre_evento + " en " + item.nombre_lugar;

    // Estado
    const tdEstado = document.createElement("td");
    const divEstado = document.createElement("div");
    divEstado.textContent = item.estado_reservacion;
    divEstado.className = getStatusClass(item.estado_reservacion);
    tdEstado.appendChild(divEstado);

    // Fecha del Evento
    const tdFecha = document.createElement("td");
    tdFecha.textContent = item.fecha_evento;

    // Hora del Evento
    const tdHora = document.createElement("td");
    tdHora.textContent = item.hora_evento;
    
    // Precio del Boleto
    const tdPrecio = document.createElement("td");
    tdPrecio.textContent = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.precio_boleto); 

    // Acciones
    const tdAcciones = document.createElement("td");
    
    // Boton de descripcion
    const btnDescripcion = document.createElement("button");
    btnDescripcion.className = "hist-btn hist-btn-desc";
    btnDescripcion.textContent = "Descripción";
    
    // Botón Cancelar
    const btnCancelar = document.createElement("button");
    btnCancelar.className = "hist-btn hist-btn-cancel";
    btnCancelar.textContent = "Cancelar";
    
    // Deshabilitar si no está pendiente y aplicar estilo CSS de deshabilitado
    if (estadoReservacion !== "pendiente") {
        btnCancelar.disabled = true;
        btnCancelar.classList.add("disabled-btn");
        btnCancelar.textContent = estadoReservacion === "cancelado" ? "Cancelado" : "Realizado";
    }

    btnDescripcion.addEventListener("click", () => {
      const descripcionDialog = document.getElementById("descripcion_reservacion");
      const contenido = document.getElementById("descripcion_reservacion_contenido");
      const titulo = document.getElementById("descripcion_reservacion_titulo");
      
      titulo.textContent = "Descripción de la Reservación";
      contenido.innerHTML = 
        "<strong>Evento:</strong> " + item.nombre_evento + "<br>" +
        "<strong>Lugar:</strong> " + item.nombre_lugar + ", " + item.ciudad + "<br>" +
        "<strong>Tipo de Actividad:</strong> " + item.tipo_actividad + "<br>" +
        "<strong>Organizador:</strong> " + item.nombre_agencia + "<br>" +
        "<strong>Descripción:</strong> " + item.descripcion + "<br><br>" +
        "<strong>Costo:</strong> " + tdPrecio.textContent + "<br>" +
        "<strong>Fecha/Hora:</strong> " + item.fecha_evento + " a las " + item.hora_evento + "<br>" +
        "<strong>Estado de la Reserva:</strong> " + item.estado_reservacion;
      
      descripcionDialog.showModal();
    });
    
    
    if (estadoReservacion === "pendiente") {
        btnCancelar.addEventListener("click", () => {
            // Guardar referencia al item actual para usar en los botones del diálogo
            currentReservacionItem = item;
            currentReservacionDivEstado = divEstado;
            currentReservacionBtnCancelar = btnCancelar;
            
            const confirmDialog = document.getElementById("confirm_cancel_reservacion");
            confirmDialog.showModal();
        });
    }


    tdAcciones.appendChild(btnDescripcion);
    tdAcciones.appendChild(btnCancelar);

    tr.appendChild(tdId);
    tr.appendChild(tdEvento);
    tr.appendChild(tdEstado);
    tr.appendChild(tdFecha);
    tr.appendChild(tdHora);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
    
}

window.initReservacionesTable = initReservacionesTable;

// Event listeners para los diálogos de reservaciones (se configuran una vez)
document.addEventListener("DOMContentLoaded", function() {
    // Diálogo de descripción
    const descripcionDialog = document.getElementById("descripcion_reservacion");
    if (descripcionDialog) {
        const buttonClose = document.getElementById("button_descripcion_reservacion_close");
        if (buttonClose) {
            buttonClose.addEventListener("click", () => {
                descripcionDialog.close();
            });
        }
    }
    
    // Diálogo de confirmación de cancelación
    const confirmDialog = document.getElementById("confirm_cancel_reservacion");
    const buttonRevert = document.getElementById("button_cancel_reservacion_revert");
    const buttonProceder = document.getElementById("button_cancel_reservacion_proceder");
    
    if (buttonRevert) {
        buttonRevert.addEventListener("click", () => {
            if (confirmDialog) confirmDialog.close();
        });
    }
    
    if (buttonProceder) {
        buttonProceder.addEventListener("click", () => {
            if (confirmDialog) confirmDialog.close();
            
            if (!currentReservacionItem) return;
            
            fetch("../../data/logic/ReservacionLogic.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accion: "cancelar_reservacion",
                    id_reservacion: currentReservacionItem.id_reservacion
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.correcto) {
                    const successDialog = document.getElementById("success_cancel_reservacion");
                    if (successDialog) successDialog.showModal();
                } else {
                    const errorDialog = document.getElementById("error_cancel_reservacion");
                    const errorMensaje = document.getElementById("error_cancel_reservacion_mensaje");
                    if (errorDialog && errorMensaje) {
                        errorMensaje.textContent = "Error: " + (data.mensaje || "Se produjo un error al cancelar la reservación");
                        errorDialog.showModal();
                    }
                }
            })
            .catch(err => {
                console.error("Error en fetch:", err);
                const errorDialog = document.getElementById("error_cancel_reservacion");
                const errorMensaje = document.getElementById("error_cancel_reservacion_mensaje");
                if (errorDialog && errorMensaje) {
                    errorMensaje.textContent = "Error de conexión al cancelar la reservación";
                    errorDialog.showModal();
                }
            });
        });
    }
    
    // Diálogo de éxito
    const successDialog = document.getElementById("success_cancel_reservacion");
    const buttonSuccessClose = document.getElementById("button_success_cancel_reservacion_close");
    if (buttonSuccessClose) {
        buttonSuccessClose.addEventListener("click", () => {
            if (successDialog) successDialog.close();
            // Actualizar el DOM sin recargar
            if (currentReservacionItem && currentReservacionDivEstado && currentReservacionBtnCancelar) {
                currentReservacionItem.estado_reservacion = "cancelado";
                currentReservacionDivEstado.textContent = "cancelado";
                currentReservacionDivEstado.className = getStatusClass("cancelado");
                currentReservacionBtnCancelar.disabled = true;
                currentReservacionBtnCancelar.classList.add("disabled-btn");
                currentReservacionBtnCancelar.textContent = "Cancelado";
            }
        });
    }
    
    // Diálogo de error
    const errorDialog = document.getElementById("error_cancel_reservacion");
    const buttonErrorClose = document.getElementById("button_error_cancel_reservacion_close");
    if (buttonErrorClose) {
        buttonErrorClose.addEventListener("click", () => {
            if (errorDialog) errorDialog.close();
        });
    }
});
