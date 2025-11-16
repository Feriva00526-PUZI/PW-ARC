
window.addEventListener("load", function(){
    let contenedorLugar = document.getElementById("selecciones");
    let ol = document.createElement("ol");
    fetch("./../../data/logic/lugarLogic.php").then(response => response.json()).then(data => {
if (data.correcto && data.lugares) {

        const lugares = data.lugares;

    lugares.forEach(data => {
        let li = document.createElement("li");
        console.log(data[1].zona);
        let liTxt = document.createTextNode(data[i].zona);
        li.appendChild(liTxt);
        li.setAttribute("class", "cards");
        ol.appendChild(li);
    });
        
    
    contenedorLugar.appendChild(ol);
    } else {
            console.log("Hubo error en el if de correcto y lugares en a_gestion_viewJS");
        }
    }).catch(error => {
        alert("Error de conexión al servidor. No se pudieron obtener los lugares.");
    });
    
})