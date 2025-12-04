function getStatusClass(status) {
    const s = (status || "").toLowerCase();

    if (s === "pendiente") return "status-en-espera badge";
    if (s === "cancelado") return "status-cancelado badge";
    if (s === "completado") return "status-realizado badge";

    return "status-en-espera badge";
}

let currentViajeItem = null;
let currentViajeDivEstado = null;
let currentViajeBtnCancelar = null;

function initHistorialTable(data) {
    const tbody = document.querySelector("#hist-table-sample tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");
        const estadoViaje = (item.estado || "").toLowerCase();

        const tdId = document.createElement("td");
        tdId.textContent = item.id_paquete;

        const tdPaquete = document.createElement("td");
        tdPaquete.textContent = item.nombre_paquete + " - " + item.nombre_lugar;

        const tdEstado = document.createElement("td");
        const divEstado = document.createElement("div");
        divEstado.textContent = item.estado;
        divEstado.className = getStatusClass(item.estado);
        tdEstado.appendChild(divEstado);

        const tdFecha = document.createElement("td");
        tdFecha.textContent = item.fecha_viaje;

        const tdHora = document.createElement("td");
        tdHora.textContent = item.hora_viaje;

        const tdAcciones = document.createElement("td");

        const btnDescripcion = document.createElement("button");
        btnDescripcion.className = "hist-btn hist-btn-desc";
        btnDescripcion.textContent = "Descripción";

        const btnCancelar = document.createElement("button");
        btnCancelar.className = "hist-btn hist-btn-cancel";
        btnCancelar.textContent = "Cancelar";

        if (estadoViaje !== "pendiente") {
            btnCancelar.disabled = true;
            btnCancelar.classList.add("disabled-btn");
            btnCancelar.textContent = estadoViaje === "cancelado" ? "Cancelado" : "Realizado";
        }

        btnDescripcion.addEventListener("click", () => {
            const descripcionDialog = document.getElementById("descripcion_viaje");
            const contenido = document.getElementById("descripcion_viaje_contenido");
            const titulo = document.getElementById("descripcion_viaje_titulo");

            if (!descripcionDialog || !contenido || !titulo) {
                console.error("Elementos del diálogo de descripción no encontrados");
                return;
            }

            titulo.textContent = "Descripción del Viaje";
            contenido.innerHTML =
                "<strong>Paquete:</strong> " + item.nombre_paquete + "<br>" +
                "<strong>Lugar:</strong> " + item.nombre_lugar + "<br>" +
                "<strong>Ciudad:</strong> " + item.ciudad + "<br>" +
                "<strong>Estado:</strong> " + item.estado + "<br>" +
                "<strong>Fecha:</strong> " + item.fecha_viaje + "<br>" +
                "<strong>Hora:</strong> " + item.hora_viaje;

            const buttonClose = document.getElementById("button_descripcion_viaje_close");
            if (buttonClose) {
                const newButtonClose = buttonClose.cloneNode(true);
                buttonClose.parentNode.replaceChild(newButtonClose, buttonClose);

                newButtonClose.addEventListener("click", () => {
                    descripcionDialog.close();
                });
            }

            descripcionDialog.showModal();
        });


        if (estadoViaje === "pendiente") {
            btnCancelar.addEventListener("click", () => {
                currentViajeItem = item;
                currentViajeDivEstado = divEstado;
                currentViajeBtnCancelar = btnCancelar;

                const confirmDialog = document.getElementById("confirm_cancel_viaje");
                if (!confirmDialog) {
                    console.error("Diálogo de confirmación no encontrado");
                    return;
                }

                const buttonRevert = document.getElementById("button_cancel_viaje_revert");
                const buttonProceder = document.getElementById("button_cancel_viaje_proceder");

                if (buttonRevert) {
                    const newButtonRevert = buttonRevert.cloneNode(true);
                    buttonRevert.parentNode.replaceChild(newButtonRevert, buttonRevert);

                    newButtonRevert.addEventListener("click", () => {
                        confirmDialog.close();
                    });
                }

                if (buttonProceder) {
                    const newButtonProceder = buttonProceder.cloneNode(true);
                    buttonProceder.parentNode.replaceChild(newButtonProceder, buttonProceder);

                    newButtonProceder.addEventListener("click", () => {
                        confirmDialog.close();

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
                                    if (successDialog) {
                                        const buttonSuccessClose = document.getElementById("button_success_cancel_viaje_close");
                                        if (buttonSuccessClose) {
                                            const newButtonSuccessClose = buttonSuccessClose.cloneNode(true);
                                            buttonSuccessClose.parentNode.replaceChild(newButtonSuccessClose, buttonSuccessClose);

                                            newButtonSuccessClose.addEventListener("click", () => {
                                                successDialog.close();
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
                                        successDialog.showModal();
                                    }
                                } else {
                                    const errorDialog = document.getElementById("error_cancel_viaje");
                                    const errorMensaje = document.getElementById("error_cancel_viaje_mensaje");
                                    if (errorDialog && errorMensaje) {
                                        errorMensaje.textContent = "Error: " + (data.mensaje || "Se produjo un error al cancelar el viaje");
                                        const buttonErrorClose = document.getElementById("button_error_cancel_viaje_close");
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
                                const errorDialog = document.getElementById("error_cancel_viaje");
                                const errorMensaje = document.getElementById("error_cancel_viaje_mensaje");
                                if (errorDialog && errorMensaje) {
                                    errorMensaje.textContent = "Error de conexión al cancelar el viaje";
                                    const buttonErrorClose = document.getElementById("button_error_cancel_viaje_close");
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
        tr.appendChild(tdPaquete);
        tr.appendChild(tdEstado);
        tr.appendChild(tdFecha);
        tr.appendChild(tdHora);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    });

}

window.initHistorialTable = initHistorialTable;

