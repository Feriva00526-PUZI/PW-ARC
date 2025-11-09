export function crearFooter({
    icono = "./src/media/images/icons/icon_arc.png",
    background = "./src/media/images/layout/imgLayout20.jpg",
    linkAbout = "#",
    posicionFondo = "50% 80%"
} = {}) {

    fetch("/src/components/footer.html")
        .then(response => response.text())
        .then(data => {
            // Insertar footer en el DOM
            document.body.insertAdjacentHTML("beforeend", data);

            // Referencias de elementos
            const f_icon = document.getElementById("f_icon");
            const f_link = document.querySelector(".f_link");
            const f_general = document.getElementById("f_general");

            // Personalización
            if (f_icon) f_icon.setAttribute("src", icono);
            if (f_link) f_link.href = linkAbout;
            if (f_general) {
                f_general.style.backgroundImage = `url(${background})`;
                f_general.style.backgroundPosition = posicionFondo;
            }
        })
        .catch(err => console.error("Error cargando footer:", err));
}
