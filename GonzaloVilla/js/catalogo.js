document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [salonesRes, imagenesRes] = await Promise.all([
      fetch("data/salones.json"),
      fetch("data/imagenes.json")
    ]);

    const salones = await salonesRes.json();
    const imagenes = await imagenesRes.json();

 
    localStorage.setItem("salones", JSON.stringify(salones));
    localStorage.setItem("imagenes", JSON.stringify(imagenes));

   
    renderizarSalones(salones, imagenes);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    document.getElementById("contenedor-catalogo").innerHTML = `<p class="text-danger">Error al cargar los salones.</p>`;
  }
});

function renderizarSalones(salones, imagenes) {
  const contenedor = document.getElementById("contenedor-catalogo");
  contenedor.innerHTML = "";

  salones.forEach(salon => {
    const imagenesSalon = imagenes.filter(img => img.idSalon === salon.id);

    const estadoBadge = salon.estado === "Disponible"
      ? `<span class="badge bg-success">Disponible</span>`
      : `<span class="badge bg-danger">Reservado</span>`;

    const imagenesHTML = imagenesSalon.length
      ? imagenesSalon.map(img => `
          <img src="${img.rutaArchivo}" alt="Imagen de ${salon.titulo}" style="width:100px; height:70px; object-fit:cover; border-radius:5px;">
        `).join("")
      : '<p class="text-muted">Sin imágenes disponibles</p>';

    contenedor.innerHTML += `
      <article class="card mb-4 p-3 shadow-sm">
        <h3>${salon.titulo}</h3>
        <p><strong>Dirección:</strong> ${salon.direccion}</p>
        <p>${salon.descripcion}</p>
        <p><strong>Valor:</strong> $${salon.valor}</p>
        <p>${estadoBadge}</p>
        <div class="d-flex flex-wrap gap-2">${imagenesHTML}</div>
      </article>
    `;
  });
}


