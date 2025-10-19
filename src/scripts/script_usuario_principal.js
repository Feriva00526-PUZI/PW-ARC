
window.addEventListener("load", function () {
    fetch("./../../components/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            const script = document.createElement("script");
            script.src = "./../../scripts/header_script.js";
            document.body.appendChild(script);

            const title_dinamic = document.getElementById("n_h2");
            title_dinamic.innerText = "PAGINA PRINCIPAL";

            document.getElementById("s_icon").setAttribute("src", "./../../media/images/icons/icon_arc.png");
            document.getElementById("a1").setAttribute("src", "./../../media/images/icons/icon_home.png");
            document.getElementById("a2").setAttribute("src", "./../../media/images/icons/icon_travel.png");
            document.getElementById("a3").setAttribute("src", "./../../media/images/icons/icon_event.png");
            document.getElementById("icon_user").setAttribute("src", "./../../media/images/icons/icon_user.png");
        });
});
