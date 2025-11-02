window.addEventListener("load", async function () {

    // Organizadora activa de sessionStorage
    const organizadora = JSON.parse(sessionStorage.getItem("organizadoraActiva"));
    if (!organizadora) {
        window.location.href = "./login.html";
        return;
    }

    // Información de la organizadora
    document.title = organizadora.nombre_agencia;
    document.getElementById("tituloAgencia").textContent = organizadora.nombre_agencia;
    document.getElementById("nombreAgencia").textContent = organizadora.nombre_agencia;
    document.getElementById("descripcionAgencia").textContent = organizadora.descripcion_agencia;
    document.getElementById("direccion").textContent = organizadora.direccion;
    document.getElementById("telefono").textContent = organizadora.telefono;
    document.getElementById("correo").textContent = organizadora.correo;
    document.getElementById("imgAgencia").src =
        `../../media/images/organizers/${organizadora.image_url}`;

    try {
        // Cargar eventos
        const response = await fetch("../../data/eventos.json");
        const eventos = await response.json();
        const misEventos = eventos
            .filter(e => e.id_organizadora === organizadora.id_organizadora)
            .sort((a, b) => new Date(a.fecha_evento) - new Date(b.fecha_evento)); // orden cronológico

        const eventosBox = document.getElementById("eventosBox");
        const calendar = document.getElementById("calendar");

        // Mostrar evento más cercano (al día de hoy)
        const hoy = new Date();
        const eventoCercano = misEventos.find(ev => new Date(ev.fecha_evento) >= hoy);
        if (eventoCercano) {
            calendar.value = eventoCercano.fecha_evento;
        }

        // Crear tarjetas de eventos
        misEventos.forEach(ev => {
            const card = document.createElement("div");
            card.className = "cards";
            card.innerHTML = `
        <span>${ev.fecha_evento}</span>
        <span>${ev.nombre_evento}</span>
        <span>$${ev.precio_boleto}</span>
      `;

            // Guardar fecha original para revertir
            const fechaOriginal = calendar.value;

            // Mostrar fecha en el calendario al hacer hover
            card.addEventListener("mouseenter", () => {
                calendar.value = ev.fecha_evento;
            });

            // Volver a la fecha original cuando se quita el hover
            card.addEventListener("mouseleave", () => {
                calendar.value = fechaOriginal;
            });

            eventosBox.appendChild(card);
        });
    } catch (err) {
        console.error("Error al cargar los eventos:", err);
    }
});
