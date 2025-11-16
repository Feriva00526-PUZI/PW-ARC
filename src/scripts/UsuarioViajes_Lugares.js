
window.addEventListener("load", function(){
    let contenedorLugar = document.getElementById("selecciones");
    let ol = document.createElement("ol");
    fetch("./../../data/logic/lugarLogic.php").then(response => response.json()).then(data => {
if (data.correcto && data.lugares) {

        const lugares = data.lugares;

    lugares.forEach(data => {
        let li = document.createElement("li");
        console.log(data.zona);
        let liTxt = document.createTextNode(data.zona);
        li.appendChild(liTxt);
        li.setAttribute("class", "cards");
        ol.appendChild(li);
    });
        
    
    contenedorLugar.appendChild(ol);
    } else {
            console.log("Hubo error en el if de correcto y lugares");
        }
    }).catch(error => {
        alert("Error de conexión al servidor. No se pudieron obtener los lugares.");
    });
    
})