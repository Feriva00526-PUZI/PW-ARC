import {
    obtenerTodosLugares
} from "../scripts/dao/daoEventos.js";
window.addEventListener("load", function(){
    let contenedorLugar = document.getElementById("selecciones");
    for(let i = 0; i <= obtenerTodosLugares.length; i++){
        let li = document.createElement("li");
        let liTxt = document.createTextNode(obtenerTodosLugares[i]);
        li.appendChild(liTxt);
        li.setAttribute("class", "cards");
        contenedorLugar.appendChild(li);
    }
})