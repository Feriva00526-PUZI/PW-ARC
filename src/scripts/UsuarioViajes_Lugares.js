
window.addEventListener("load", function () {
    let contenedorLugar = document.getElementById("selecciones");
    let contenedorPaquete = document.getElementById("paquete");
    let paqcont = 1;
    let ol = document.createElement("ol");

    fetch("./../../data/logic/lugarLogic.php").then(response => response.json()).then(data => {
        if (data.correcto && data.lugares) {

            const lugares = data.lugares;

            lugares.forEach(data => {
                let li = document.createElement("li");

                let liTxt = document.createTextNode(data.nombre_lugar);
                li.appendChild(liTxt);
                li.setAttribute("class", "cards");
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
        alert("Error de conexión al servidor. No se pudieron obtener los lugares.");
    });


}

)