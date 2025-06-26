document.addEventListener("DOMContentLoaded", async () => {
  try {
    let salones = JSON.parse(localStorage.getItem("salones"));

    if (!salones) {
      const salonesReserva = await fetch("data/salones.json");
      salones = await salonesReserva.json();
      localStorage.setItem("salones", JSON.stringify(salones));
    }

    // Cargar y fusionar imágenes
    const imagenesJSON = await fetch("data/imagenes.json").then(res => res.json());
    const imagenesLocales = JSON.parse(localStorage.getItem("imagenes")) || [];

    const rutasExistentes = new Set(imagenesLocales.map(img => img.rutaArchivo));
    const imagenesFusionadas = [
      ...imagenesLocales,
      ...imagenesJSON.filter(img => !rutasExistentes.has(img.rutaArchivo))
    ];

    localStorage.setItem("imagenes", JSON.stringify(imagenesFusionadas));

    renderizarSalones(salones, imagenesFusionadas);

    renderizarSalones(salones, imagenes);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
});


function renderizarSalones(salones, imagenes) {
  const contenedor = document.getElementById("contenedor-catalogo");
  contenedor.innerHTML = "";

  // Eliminar duplicados por clave idSalon-rutaArchivo
  const unicas = [];
  const claves = new Set();
  for (const img of imagenes) {
    const clave = `${img.idSalon}-${img.rutaArchivo}`;
    if (!claves.has(clave)) {
      claves.add(clave);
      unicas.push(img);
    }
  }

  salones.forEach(salon => {
    const imagenesSalon = unicas.filter(img => img.idSalon === salon.id);

    const estadoBadge = salon.estado === "Disponible"
      ? `<span class="badge bg-success">Disponible</span>`
      : `<span class="badge bg-danger">Reservado</span>`;

    const imagenesHTML = imagenesSalon.length
      ? imagenesSalon.map(img => `
          <img 
            src="${img.rutaArchivo}" 
            alt="Imagen de ${salon.titulo}" 
            onerror="this.style.display='none'" 
            style="width:100px; height:70px; object-fit:cover; border-radius:5px;">
        `).join("")
      : '<p class="text-muted">Sin imágenes disponibles</p>';
    const boton = salon.estado === "Disponible"
      ? `<a href="presupuesto.html?idSalon=${salon.id}" class="btn btn-primary mt-2">Solicitar presupuesto</a>`
      : `<button class="btn btn-secondary mt-2" disabled>Reservado</button>`;

    contenedor.innerHTML += `
      <article class="card mb-4 p-3 shadow-sm">
        <h3>${salon.titulo}</h3>
        <p><strong>Dirección:</strong> ${salon.direccion}</p>
        <p>${salon.descripcion}</p>
        <p><strong>Valor:</strong> $${salon.valor}</p>
        <p>${estadoBadge}</p>
        <div class="d-flex flex-wrap gap-2">${imagenesHTML}</div>
        ${boton}
      </article>
    `;
  });
}


window.abrirFormularioPresupuesto = (idSalon) => {
  document.getElementById("salonSeleccionado").value = idSalon;
  document.getElementById("formPresupuesto").classList.remove("d-none");

  const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
  const contenedorServicios = document.getElementById("serviciosCheckboxes");
  contenedorServicios.innerHTML = servicios.map(servicio => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${servicio.id}" id="servicio-${servicio.id}">
      <label class="form-check-label" for="servicio-${servicio.id}">
        ${servicio.nombre} ($${servicio.valor})
      </label>
    </div>
  `).join("");
};

