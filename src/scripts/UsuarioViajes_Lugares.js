export async function obtenerTodosLugares() {
  try {
    const response = await fetch("/src/data/lugares.json");
    if (!response.ok) throw new Error("Error al cargar lugares");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
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