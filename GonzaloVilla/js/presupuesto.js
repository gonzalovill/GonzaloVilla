const selectSalon = document.getElementById('salon');
const divServicios = document.getElementById('servicios');
const form = document.getElementById('formPresupuesto');
const resultado = document.getElementById('resultado');

let salones = [];
let servicios = [];
let presupuestos = [];

async function cargarDatos() {
  try {
    const resSalones = await fetch('./data/salones.json');
    salones = await resSalones.json();

    const resServicios = await fetch('./data/servicios.json');
    servicios = await resServicios.json();

    const presupuestosLS = localStorage.getItem("presupuestos");
    if (presupuestosLS) {
      presupuestos = JSON.parse(presupuestosLS);
    }

    const params = new URLSearchParams(window.location.search);
    const idSalonURL = params.get("idSalon");

    salones.forEach(salon => {
      if (salon.estado === "Disponible") {
        const option = document.createElement("option");
        option.value = salon.id;
        option.textContent = salon.titulo;
        selectSalon.appendChild(option);
      }
    });

    if (idSalonURL) {
      selectSalon.value = idSalonURL;
    }

    servicios.forEach(servicio => {
      const div = document.createElement("div");
      div.classList.add("form-check");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("form-check-input");
      checkbox.id = `servicio-${servicio.id}`;
      checkbox.value = servicio.id;

      const label = document.createElement("label");
      label.classList.add("form-check-label");
      label.htmlFor = checkbox.id;
      label.textContent = servicio.nombre;

      div.appendChild(checkbox);
      div.appendChild(label);
      divServicios.appendChild(div);
    });

  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

function guardarPresupuesto(presupuesto) {
  presupuestos.push(presupuesto);
  localStorage.setItem("presupuestos", JSON.stringify(presupuestos));
  console.log("Simulación de POST a presupuestos.json:");
  console.log(JSON.stringify(presupuestos, null, 2));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const fecha = document.getElementById("fecha").value;
  const idSalon = parseInt(selectSalon.value);
  const salon = salones.find(s => s.id === idSalon);

  const serviciosSeleccionados = servicios.filter(servicio => {
    const checkbox = document.getElementById(`servicio-${servicio.id}`);
    return checkbox && checkbox.checked;
  });

  const valorServicios = serviciosSeleccionados.reduce((total, s) => total + Number(s.valor), 0);
  const valorSalon = Number(salon.valor);
  const valorTotal = valorSalon + valorServicios;

  const presupuesto = {
    id: Date.now(),
    nombre,
    fecha,
    tema: "No definido",
    valorTotal,
    servicios: serviciosSeleccionados.map(s => ({
      id: s.id,
      nombre: s.nombre,
      descripcion: s.descripcion
    }))
  };

  guardarPresupuesto(presupuesto);

  const indexSalon = salones.findIndex(s => s.id === idSalon);
  if (indexSalon !== -1) {
    salones[indexSalon].estado = "Reservado";
    localStorage.setItem("salones", JSON.stringify(salones));
  }

  form.classList.add("d-none");


  resultado.innerHTML = `
    <div class="alert alert-success">
      <h4>¡Presupuesto confirmado!</h4>
      <p><strong>Cliente:</strong> ${nombre}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Salón:</strong> ${salon.titulo} ($${valorSalon})</p>
      <p><strong>Servicios:</strong> ${serviciosSeleccionados.map(s => s.nombre).join(", ")} ($${valorServicios})</p>
      <p><strong>Total:</strong> $${valorTotal}</p>
      <button id="volverBtn" class="btn btn-primary mt-3">Volver al catálogo</button>
    </div>
  `;

  document.getElementById("volverBtn").addEventListener("click", () => {
    window.location.href = "catalogo.html";
  });
});

document.addEventListener("DOMContentLoaded", cargarDatos);
