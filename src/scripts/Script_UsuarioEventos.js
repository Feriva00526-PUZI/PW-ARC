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
    let fecha = document.getElementById("Fecha");
    let hora = document.getElementById("Hora");

    fetch("./../../data/logic/eventoLogic.php").then(response => response.json()).then(data => {
        if (data.correcto && data.eventos) {

            const eventos = data.eventos;

            eventos.forEach(data => {
                let li = document.createElement("li");

                let liTxt = document.createTextNode(data.nombre_evento + ", " + data.descripcion);
                console.log(data.nombre_evento);
                li.appendChild(liTxt);
                li.setAttribute("class", "minicard");
                li.addEventListener("click", function () {
                    //let id_evento = data.id_evento;
                    //console.log(id_lugar);
                    //fetch(`./../../data/logic/PaquetesLogic.php?id_lugar=${id_lugar}`).then(response => response.json()).then(data => {
                        //if (data.correcto && data.paquete) {
                        //const paquetes = data.paquetes;
                        contenedorPaquete.innerHTML = "";
                        //paquetes.forEach(data => {
                            let div = document.createElement("div");
                            let divTxt = document.createTextNode("Reservar,"  + " Precio: " + data.precio_boleto);
                            div.appendChild(divTxt);
                            div.setAttribute("id", "paq" + paqcont);
                            paqcont++;
                            div.setAttribute("class", "minicard");
                            contenedorPaquete.appendChild(div);
                            const imgMapa = document.getElementById("imgMapa");
                            imgMapa.src = `./../../media/images/events/${data.id_evento}.jpg`;
                            let con = 0;
                            div.addEventListener("click", function(){
                                fecha.innerText = "Fecha del evento: " + data.fecha_evento;
                                hora.innerText = "Hora del evento: " + data.hora_evento;
                                modal.showModal();
                                
                                btn_aceptar.addEventListener("click", () => {
                                    console.log(con);
                                if(con == 0){
                                const miArray = JSON.parse(usuarioSession);
                                let id_evento = data.id_evento;
                                let id_cliente = miArray.id_cliente; 
                                //let id_paquete = data.id_paquete; 
                                let estado = "pendiente"; 
                                
                                const formData = new FormData();
                                formData.append("id_evento",id_evento);
                                formData.append("id_cliente",id_cliente);
                                //formData.append("id_paquete",id_paquete);
                                formData.append("estado",estado);
                                
                                fetch(`./../../data/logic/CrearReservacionLogic.php`, {
                                        method: 'POST',
                                        body: formData
                                    }).then(response => response.json()).then(data => {
                                        console.log("funcionó??"+ data.mensaje);
                                    });
                                    con++;
                                modal.close();}
    //});
                                
                            //});
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