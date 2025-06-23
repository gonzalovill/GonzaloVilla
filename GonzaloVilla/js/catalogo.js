import { inicializarSalones } from './data.js';

inicializarSalones();

const contenedor = document.getElementById("contenedor-catalogo");
const salones = JSON.parse(localStorage.getItem("salones")) || [];

if (!salones.length) {
  contenedor.innerHTML = "<p>No hay salones cargados.</p>";
} else {
  salones.forEach((salon) => {
    const card = document.createElement("div");
    card.className = "card mb-4";

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${salon.nombre}</h5>
        <p class="card-text"><strong>📍</strong> ${salon.direccion}</p>
        <p class="card-text">${salon.descripcion}</p>
        <div class="d-flex flex-wrap">
          ${salon.imagenes.map(img => `
            <img src="${img}" class="img-fluid mb-3 img-salon" style="width: 250px; height: auto; margin: 5px; border-radius: 8px;">
          `).join("")}
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}


