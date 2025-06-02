const contenedor = document.getElementById("contenedor-catalogo");

let salonesGuardados = localStorage.getItem("salones");


if (!salonesGuardados) {
  localStorage.setItem("salones", JSON.stringify([])); 
  salonesGuardados = "[]";
}

const salones = JSON.parse(salonesGuardados);

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



