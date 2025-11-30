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
      
      if (!descripcionDialog || !contenido || !titulo) {
        console.error("Elementos del diálogo de descripción no encontrados");
        return;
      }
      
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
      
      // Configurar el botón de cerrar cada vez que se abre el diálogo
      const buttonClose = document.getElementById("button_descripcion_reservacion_close");
      if (buttonClose) {
        // Remover listeners anteriores
        const newButtonClose = buttonClose.cloneNode(true);
        buttonClose.parentNode.replaceChild(newButtonClose, buttonClose);
        
        newButtonClose.addEventListener("click", () => {
          descripcionDialog.close();
        });
      }
      
      descripcionDialog.showModal();
    });
    
    
    if (estadoReservacion === "pendiente") {
        btnCancelar.addEventListener("click", () => {
            // Guardar referencia al item actual para usar en los botones del diálogo
            currentReservacionItem = item;
            currentReservacionDivEstado = divEstado;
            currentReservacionBtnCancelar = btnCancelar;
            
            const confirmDialog = document.getElementById("confirm_cancel_reservacion");
            if (!confirmDialog) {
                console.error("Diálogo de confirmación no encontrado");
                return;
            }
            
            // Configurar los botones cada vez que se abre el diálogo
            const buttonRevert = document.getElementById("button_cancel_reservacion_revert");
            const buttonProceder = document.getElementById("button_cancel_reservacion_proceder");
            
            if (buttonRevert) {
                // Remover listeners anteriores
                const newButtonRevert = buttonRevert.cloneNode(true);
                buttonRevert.parentNode.replaceChild(newButtonRevert, buttonRevert);
                
                newButtonRevert.addEventListener("click", () => {
                    confirmDialog.close();
                });
            }
            
            if (buttonProceder) {
                // Remover listeners anteriores
                const newButtonProceder = buttonProceder.cloneNode(true);
                buttonProceder.parentNode.replaceChild(newButtonProceder, buttonProceder);
                
                newButtonProceder.addEventListener("click", () => {
                    confirmDialog.close();
                    
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
                            if (successDialog) {
                                // Configurar botón de cerrar éxito
                                const buttonSuccessClose = document.getElementById("button_success_cancel_reservacion_close");
                                if (buttonSuccessClose) {
                                    const newButtonSuccessClose = buttonSuccessClose.cloneNode(true);
                                    buttonSuccessClose.parentNode.replaceChild(newButtonSuccessClose, buttonSuccessClose);
                                    
                                    newButtonSuccessClose.addEventListener("click", () => {
                                        successDialog.close();
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
                                successDialog.showModal();
                            }
                        } else {
                            const errorDialog = document.getElementById("error_cancel_reservacion");
                            const errorMensaje = document.getElementById("error_cancel_reservacion_mensaje");
                            if (errorDialog && errorMensaje) {
                                errorMensaje.textContent = "Error: " + (data.mensaje || "Se produjo un error al cancelar la reservación");
                                // Configurar botón de cerrar error
                                const buttonErrorClose = document.getElementById("button_error_cancel_reservacion_close");
                                if (buttonErrorClose) {
                                    const newButtonErrorClose = buttonErrorClose.cloneNode(true);
                                    buttonErrorClose.parentNode.replaceChild(newButtonErrorClose, buttonErrorClose);
                                    
                                    newButtonErrorClose.addEventListener("click", () => {
                                        errorDialog.close();
                                    });
                                }
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
                            // Configurar botón de cerrar error
                            const buttonErrorClose = document.getElementById("button_error_cancel_reservacion_close");
                            if (buttonErrorClose) {
                                const newButtonErrorClose = buttonErrorClose.cloneNode(true);
                                buttonErrorClose.parentNode.replaceChild(newButtonErrorClose, buttonErrorClose);
                                
                                newButtonErrorClose.addEventListener("click", () => {
                                    errorDialog.close();
                                });
                            }
                            errorDialog.showModal();
                        }
                    });
                });
            }
            
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
