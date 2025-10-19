/*Detecta cualquier scroll*/
window.addEventListener("scroll", function () {
    const s_header = document.getElementById("s_header");
    /*se toma el tamaño de la ventana y se multiplica por 0.4 para indicar cuanto scroll de la pantalla se tiene que detectar para efectuar el cambio*/
    const scrollPoint = window.innerHeight * 0.4;

    if (window.scrollY > scrollPoint) {
        s_header.classList.add("little");
    } else {
        s_header.classList.remove("little");
    }

    let underline_nav = document.getElementById("underline_nav");
    let headerHeight = s_header.offsetHeight;
    underline_nav.style.top = headerHeight - 2 + "px";
});

window.addEventListener("load", function () {
    const s_header = document.getElementById("s_header");
    let underline_nav = document.getElementById("underline_nav");
    let headerHeight = s_header.offsetHeight;
    underline_nav.style.top = headerHeight - 2 + "px";
});