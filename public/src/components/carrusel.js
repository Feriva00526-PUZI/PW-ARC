// ==========================
// //Hola carlos un saludo si ves esto
// ==========================

// Datos del carrusel: agrega o cambia los nombres aqui
const tarjetas = [
  { name: "Karisma Hotels & Resorts", imgCandidates: ['../../media/images/user/Karisma Hotels & Resorts.png'] },
  { name: "Hoteles Xcaret", imgCandidates: ['../../media/images/user/Hoteles Xcaret.png'] },
  { name: "Palace Resorts", imgCandidates: ['../../media/images/user/Palace Resorts.png'] },
  { name: "Ixtapa-Zihuatanejo", imgCandidates: ['../../media/images/user/Ixtapa-Zihuatanejo.png'] },
  { name: "Los Cabos", imgCandidates: ['../../media/images/user/Los Cabos.png'] },

];

// Genera las tarjetas dinamicamente
const track = document.getElementById('track');
tarjetas.forEach(item => {
  const card = document.createElement('div');
  card.classList.add('card');

  if (item.imgCandidates) {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = item.name;
    img.src = encodeURI(item.imgCandidates[0]); // encode espacios
    img.onerror = () => {
      if (item.imgCandidates[1]) img.src = encodeURI(item.imgCandidates[1]);
    };
    card.appendChild(img);
  }

  const p = document.createElement('p');
  p.textContent = item.name;
  card.appendChild(p);
  track.appendChild(card);
});

// Duplica las tarjetas para efecto infinito
let cards = Array.from(track.children);
cards.forEach(card => {
  const clone = card.cloneNode(true);
  track.appendChild(clone);
});

cards = Array.from(track.children);
const cardWidth = cards[0].getBoundingClientRect().width + 20;
let index = 0;

// Actualiza posicion
const updateCarousel = () => {
  track.style.transition = 'transform 0.5s ease-in-out';
  track.style.transform = 'translateX(-' + index * cardWidth + 'px)';
};

// Controles
document.querySelector('.arrow-left').addEventListener('click', () => {
  index--;
  if (index < 0) {
    track.style.transition = 'none';
    index = cards.length / 2 - 1;
    track.style.transform = 'translateX(-' + index * cardWidth + 'px)';
    setTimeout(() => {
      index--;
      track.style.transition = 'transform 0.5s ease-in-out';
      updateCarousel();
    }, 20);
  } else {
    updateCarousel();
  }
});

document.querySelector('.arrow-right').addEventListener('click', () => {
  index++;
  updateCarousel();
  if (index >= cards.length / 2) {
    setTimeout(() => {
      track.style.transition = 'none';
      index = 0;
      track.style.transform = 'translateX(0px)';
      setTimeout(() => {
        track.style.transition = 'transform 0.5s ease-in-out';
      }, 20);
    }, 500);
  }
});

// Movimiento automatico
setInterval(() => {
  index++;
  updateCarousel();
  if (index >= cards.length / 2) {
    setTimeout(() => {
      track.style.transition = 'none';
      index = 0;
      track.style.transform = 'translateX(0px)';
      setTimeout(() => {
        track.style.transition = 'transform 0.5s ease-in-out';
      }, 20);
    }, 500);
  }
}, 15000);

updateCarousel();
