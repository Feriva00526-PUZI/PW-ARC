window.addEventListener("load", function () {
    const usuarioSession = sessionStorage.getItem("usuario_logeado");
    if (usuarioSession == null) {
        window.location.href = "./../../../index.html";
        return;
    }
    let contenedorLugar = document.getElementById("selecciones");
    let contenedorPaquete = document.getElementById("paquete");
    let paqcont = 1;
    let ol = document.createElement("ol");
    let modal = document.getElementById("fecha_select");
    let btn_aceptar = document.getElementById("button_continuar");
    let btn_noAceptar = document.getElementById("button_noContinuar");
    let descripcion = document.getElementById("descripcion");
    let tit = document.getElementById("titulo");
    let desc = document.getElementById("desc");

    fetch("./../../data/Logic/lugarLogic.php").then(response => response.json()).then(data1 => {
        console.log(data1);

        if (data1.correcto && data1.lugares) {

            const lugares = data1.lugares;
            lugares.forEach(data1 => {
                let li = document.createElement("li");

                let liTxt = document.createTextNode(data1.nombre_lugar);
                li.appendChild(liTxt);
                li.setAttribute("class", "minicard");
                li.addEventListener("click", function () {
                    let id_lugar = data1.id_lugar;
                    console.log(id_lugar);

                    fetch(`./../../data/logic/PaquetesLogic.php?id_lugar=${id_lugar}`).then(response => response.json()).then(data => {
                        const paquetes = data.paquetes;
                        contenedorPaquete.innerHTML = "";
                        paquetes.forEach(data => {
                            tit.innerText = data1.nombre_lugar;
                            desc.innerText = data1.descripcion;
                            console.log(tit.innerText);
                            let div = document.createElement("div");
                            paqcont++;
                            div.innerHTML = `<div class="minicard"> <p style="font-size: 20px">${data.nombre_paquete}</p>
                            <br> <p style="font-style: italic">Precio: $${data.precio}</p> </div>`;
                            contenedorPaquete.appendChild(div);
                            const imgMapa = document.getElementById("imgMapa");
                            imgMapa.src = `./../../media/images/lugares/limg${data.id_lugar}.jpg`;
                            let con = 0;
                            div.addEventListener("click", function () {
                                descripcion.innerText = data.descripcion_paquete;

                                modal.showModal();
                                btn_aceptar.addEventListener("click", () => {
                                    console.log(con);
                                    if (con == 0) {
                                        let fecha = document.getElementById("fecha");
                                        console.log(fecha.value);
                                        let hora = document.getElementById("hora");
                                        console.log(hora.value);
                                        const miArray = JSON.parse(usuarioSession);
                                        let id_cliente = miArray.id_cliente;
                                        let id_paquete = data.id_paquete;
                                        let estado = "pendiente";
                                        let fecha_viaje = fecha.value;
                                        let hora_viaje = hora.value;
                                        const formData = new FormData();
                                        formData.append("id_cliente", id_cliente);
                                        formData.append("id_paquete", id_paquete);
                                        formData.append("estado", estado);
                                        formData.append("fecha_viaje", fecha_viaje);
                                        formData.append("hora_viaje", hora_viaje);

                                        fetch(`./../../data/logic/CrearViajeLogic.php`, {
                                            method: 'POST',
                                            body: formData
                                        }).then(response => response.json()).then(data => {
                                            console.log("funcionó??" + data.mensaje);
                                        });
                                        con++;
                                        modal.close();
                                    }
                                });

                            });
                        }

                        )
                        if (contenedorPaquete.innerHTML == "") {
                            alert("No tiene paquetes disponibles");
                        }
                    });
                })
                ol.appendChild(li);

            });


            contenedorLugar.appendChild(ol);
        } else {
            console.log("Hubo error en el if de correcto y lugares");
        }
    }).catch(error => {
        console.log("Error de conexion al servidor. No se pudieron obtener los lugares." + error);
    });
    btn_noAceptar.addEventListener("click", () => {
        modal.close();
    });

}

)