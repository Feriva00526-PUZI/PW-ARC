import {
    obtenerTodosLugares
} from "../scripts/dao/daoEventos.js";
window.addEventListener("load", function(){
    let contenedorLugar = document.getElementById("selecciones");
    let ol = document.createElement("ol");
    for(let i = 0; i <= obtenerTodosLugares.length; i++){
        let li = document.createElement("li");
        let liTxt = document.createTextNode(obtenerTodosLugares[i]);
        li.appendChild(liTxt);
        li.setAttribute("class", "cards");
        ol.appendChild(li);
    }
    contenedorLugar.appendChild(ol);
})