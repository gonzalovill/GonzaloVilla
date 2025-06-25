async function cargarServicios() {
  if (!localStorage.getItem("servicios")) {
    try {
      const res = await fetch('data/servicios.json');
      const servicios = await res.json();
      localStorage.setItem("servicios", JSON.stringify(servicios));
    } catch (error) {
      console.error("Error cargando servicios:", error);
      localStorage.setItem("servicios", JSON.stringify([]));
    }
  }
}

function mostrarServicios() {
  const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
  const tabla = document.getElementById("tabla-servicios");
  tabla.innerHTML = "";

  servicios.forEach(servicio => {
    tabla.innerHTML += `
      <tr>
        <td>${servicio.nombre}</td>
        <td>${servicio.descripcion}</td>
        <td>$${servicio.valor}</td>
      </tr>
    `;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarServicios();
  mostrarServicios();
});
