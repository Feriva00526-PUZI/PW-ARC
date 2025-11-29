function getStatusClass(status) {
  const s = (status || "").toLowerCase();

  if (s === "pendiente") return "status-en-espera badge";
  if (s === "cancelado") return "status-cancelado badge";
  if (s === "completado") return "status-realizado badge";

  return "status-en-espera badge";
}

// Variables globales para mantener el contexto del item actual
let currentViajeItem = null;
let currentViajeDivEstado = null;
let currentViajeBtnCancelar = null;

function initHistorialTable(data) {
  const tbody = document.querySelector("#hist-table-sample tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const tr = document.createElement("tr");
    const estadoViaje = (item.estado || "").toLowerCase(); // Normalizar el estado

    // id_paquete
    const tdId = document.createElement("td");
    tdId.textContent = item.id_paquete;
    

    // nombre del paquete (INNER JOIN)
    const tdPaquete = document.createElement("td");
    tdPaquete.textContent = item.nombre_paquete + " - " + item.nombre_lugar;

    // Estado
    const tdEstado = document.createElement("td");
    const divEstado = document.createElement("div");
    divEstado.textContent = item.estado;
    divEstado.className = getStatusClass(item.estado);
    tdEstado.appendChild(divEstado);

    // Fecha
    const tdFecha = document.createElement("td");
    tdFecha.textContent = item.fecha_viaje;

    // Hora
    const tdHora = document.createElement("td");
    tdHora.textContent = item.hora_viaje;

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
    if (estadoViaje !== "pendiente") {
        btnCancelar.disabled = true;
        btnCancelar.classList.add("disabled-btn");
        btnCancelar.textContent = estadoViaje === "cancelado" ? "Cancelado" : "Realizado";
    }

    btnDescripcion.addEventListener("click", () => {
      const descripcionDialog = document.getElementById("descripcion_viaje");
      const contenido = document.getElementById("descripcion_viaje_contenido");
      const titulo = document.getElementById("descripcion_viaje_titulo");
      
      titulo.textContent = "Descripción del Viaje";
      contenido.innerHTML = 
        "<strong>Paquete:</strong> " + item.nombre_paquete + "<br>" +
        "<strong>Lugar:</strong> " + item.nombre_lugar + "<br>" +
        "<strong>Ciudad:</strong> " + item.ciudad + "<br>" +
        "<strong>Estado:</strong> " + item.estado + "<br>" +
        "<strong>Fecha:</strong> " + item.fecha_viaje + "<br>" +
        "<strong>Hora:</strong> " + item.hora_viaje;
      
      descripcionDialog.showModal();
    });
    
    
    if (estadoViaje === "pendiente") {
        btnCancelar.addEventListener("click", () => {
            // Guardar referencia al item actual para usar en los botones del diálogo
            currentViajeItem = item;
            currentViajeDivEstado = divEstado;
            currentViajeBtnCancelar = btnCancelar;
            
            const confirmDialog = document.getElementById("confirm_cancel_viaje");
            confirmDialog.showModal();
        });
    }


    tdAcciones.appendChild(btnDescripcion);
    tdAcciones.appendChild(btnCancelar);

    tr.appendChild(tdId);
    tr.appendChild(tdPaquete);
    tr.appendChild(tdEstado);
    tr.appendChild(tdFecha);
    tr.appendChild(tdHora);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
    
}

window.initHistorialTable = initHistorialTable;

// Event listeners para los diálogos de viajes (se configuran una vez)
document.addEventListener("DOMContentLoaded", function() {
    // Diálogo de descripción
    const descripcionDialog = document.getElementById("descripcion_viaje");
    if (descripcionDialog) {
        const buttonClose = document.getElementById("button_descripcion_viaje_close");
        if (buttonClose) {
            buttonClose.addEventListener("click", () => {
                descripcionDialog.close();
            });
        }
    }
    
    // Diálogo de confirmación de cancelación
    const confirmDialog = document.getElementById("confirm_cancel_viaje");
    const buttonRevert = document.getElementById("button_cancel_viaje_revert");
    const buttonProceder = document.getElementById("button_cancel_viaje_proceder");
    
    if (buttonRevert) {
        buttonRevert.addEventListener("click", () => {
            if (confirmDialog) confirmDialog.close();
        });
    }
    
    if (buttonProceder) {
        buttonProceder.addEventListener("click", () => {
            if (confirmDialog) confirmDialog.close();
            
            if (!currentViajeItem) return;
            
            fetch("../../data/logic/HistorialLogic.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accion: "cancelar",
                    id_viaje: currentViajeItem.id_viaje
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.correcto) {
                    const successDialog = document.getElementById("success_cancel_viaje");
                    if (successDialog) successDialog.showModal();
                } else {
                    const errorDialog = document.getElementById("error_cancel_viaje");
                    const errorMensaje = document.getElementById("error_cancel_viaje_mensaje");
                    if (errorDialog && errorMensaje) {
                        errorMensaje.textContent = "Error: " + (data.mensaje || "Se produjo un error al cancelar el viaje");
                        errorDialog.showModal();
                    }
                }
            })
            .catch(err => {
                console.error("Error en fetch:", err);
                const errorDialog = document.getElementById("error_cancel_viaje");
                const errorMensaje = document.getElementById("error_cancel_viaje_mensaje");
                if (errorDialog && errorMensaje) {
                    errorMensaje.textContent = "Error de conexión al cancelar el viaje";
                    errorDialog.showModal();
                }
            });
        });
    }
    
    // Diálogo de éxito
    const successDialog = document.getElementById("success_cancel_viaje");
    const buttonSuccessClose = document.getElementById("button_success_cancel_viaje_close");
    if (buttonSuccessClose) {
        buttonSuccessClose.addEventListener("click", () => {
            if (successDialog) successDialog.close();
            // Actualizar el DOM sin recargar
            if (currentViajeItem && currentViajeDivEstado && currentViajeBtnCancelar) {
                currentViajeItem.estado = "cancelado";
                currentViajeDivEstado.textContent = "cancelado";
                currentViajeDivEstado.className = getStatusClass("cancelado");
                currentViajeBtnCancelar.disabled = true;
                currentViajeBtnCancelar.classList.add("disabled-btn");
                currentViajeBtnCancelar.textContent = "Cancelado";
            }
        });
    }
    
    // Diálogo de error
    const errorDialog = document.getElementById("error_cancel_viaje");
    const buttonErrorClose = document.getElementById("button_error_cancel_viaje_close");
    if (buttonErrorClose) {
        buttonErrorClose.addEventListener("click", () => {
            if (errorDialog) errorDialog.close();
        });
    }
});
