
window.addEventListener("load", function(){
    let contenedorLugar = document.getElementById("selecciones");
    let ol = document.createElement("ol");
    fetch("./../../data/logic/lugarLogic.php").then(response => response.json()).then(data => {
    for(let i = 0; i <= data.length; i++){
        let li = document.createElement("li");
        let liTxt = document.createTextNode(data[i].zona);
        li.appendChild(liTxt);
        li.setAttribute("class", "cards");
        ol.appendChild(li);
    }
    contenedorLugar.appendChild(ol);
    }).catch(error => {
        alert("Error de conexión al servidor. No se pudieron obtener los lugares.");
    });
    
})