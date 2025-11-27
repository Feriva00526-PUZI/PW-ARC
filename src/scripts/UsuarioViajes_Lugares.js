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
    

    fetch("./../../data/logic/lugarLogic.php").then(response => response.json()).then(data => {
        if (data.correcto && data.lugares) {

            const lugares = data.lugares;

            lugares.forEach(data => {
                let li = document.createElement("li");

                let liTxt = document.createTextNode(data.nombre_lugar);
                li.appendChild(liTxt);
                li.setAttribute("class", "minicard");
                li.addEventListener("click", function () {
                    let id_lugar = data.id_lugar;
                    console.log(id_lugar);
                    fetch(`./../../data/logic/PaquetesLogic.php?id_lugar=${id_lugar}`).then(response => response.json()).then(data => {
                        //if (data.correcto && data.paquete) {
                        const paquetes = data.paquetes;
                        contenedorPaquete.innerHTML = "";
                        paquetes.forEach(data => {
                            let div = document.createElement("div");
                            let divTxt = document.createTextNode(data.nombre_paquete);
                            div.appendChild(divTxt);
                            div.setAttribute("id", "paq" + paqcont);
                            paqcont++;
                            div.setAttribute("class", "minicard");
                            contenedorPaquete.appendChild(div);
                            const imgMapa = document.getElementById("imgMapa");
                            imgMapa.src = `./../../media/images/lugares/limg${data.id_lugar}.jpg`;
                            div.addEventListener("click", function(){
                                modal.showModal();
                                btn_aceptar.addEventListener("click", () => {
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
                                formData.append("id_cliente",id_cliente);
                                formData.append("id_paquete",id_paquete);
                                formData.append("estado",estado);
                                formData.append("fecha_viaje",fecha_viaje);
                                formData.append("hora_viaje",hora_viaje);
                                
                                fetch(`./../../data/logic/CrearViajeLogic.php`, {
                                        method: 'POST',
                                        body: formData
                                    }).then(response => response.json()).then(data => {
                                        console.log("funcionó??"+ data.mensaje);
                                    });
                                modal.close();
    });
                                
                            });
                        }

                        )
                        if (contenedorPaquete.innerHTML == "") {
                            alert("No tiene paquetes disponibles");
                        }
                        //} else {    
                        //          console.log(data.correcto);
                        //        console.log(data.paquete);
                        //      console.log("Hubo error en el if de correcto y paquetes");
                        //} 
                    });
                })
                ol.appendChild(li);

            });


            contenedorLugar.appendChild(ol);
        } else {
            console.log("Hubo error en el if de correcto y lugares");
        }
    }).catch(error => {
        alert("Error de conexiÃ³n al servidor. No se pudieron obtener los lugares.");
    });
btn_noAceptar.addEventListener("click", () => {
        modal.close();
    });

}

)