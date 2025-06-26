import { editarSalon, eliminarSalon, editarServicio, eliminarServicio } from './acciones.js';
document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("accessToken");
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

  if (!token || !usuario) {
    window.location.href = "../login.html";
    return;
  }

  if (usuario.role !== "admin") {
    alert("Solo administradores pueden acceder al panel.");
    window.location.href = "../catalogo.html";
    return;
  }

  await cargadeDatos();
  renderizarSalones();
  renderizarServicios();
});
async function cargadeDatos() {
  await cargardatosSinohay("salones", "salones.json");
  await cargardatosSinohay("servicios", "servicios.json");
  await cargardatosSinohay("presupuestos", "presupuestos.json");
  const imagenesGuardadas = JSON.parse(localStorage.getItem("imagenes"));

  if (!imagenesGuardadas || imagenesGuardadas.length === 0) {
    try {
      const res = await fetch("../data/imagenes.json");
      const imagenesDesdeArchivo = await res.json();

      localStorage.setItem("imagenes", JSON.stringify(imagenesDesdeArchivo));
    } catch (e) {
      console.error("Error cargando imagenes.json:", e);
    }
  }
}

async function cargardatosSinohay(clave, archivo) {
  if (!localStorage.getItem(clave)) {
    try {
      const res = await fetch(`../data/${archivo}`);
      const datos = await res.json();
      localStorage.setItem(clave, JSON.stringify(datos));
    } catch (e) {
      console.error(`Error al cargar ${archivo}:`, e);
    }
  }
}

function guardarEnLocalStorage(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

function renderizarSalones() {
  const salones = JSON.parse(localStorage.getItem("salones")) || [];
  const imagenes = JSON.parse(localStorage.getItem("imagenes")) || [];
  const tabla = document.getElementById("tabla-salones");
  tabla.innerHTML = "";

  salones.forEach((salon) => {
    const imagenesSalon = imagenes.filter(img => img.idSalon === salon.id);

    const htmlImagenes = imagenesSalon.map(img => 
      `<img src="../${img.rutaArchivo}" alt="Imagen de ${salon.titulo}" style="width: 60px; height: auto; margin-right: 5px;" />`
    ).join("");

    tabla.innerHTML += `
      <tr>
        <td>${salon.titulo}</td>
        <td>${salon.direccion}</td>
        <td>${salon.descripcion}</td>
        <td>$${salon.valor}</td>
        <td class="${salon.estado === "Disponible" ? "text-success" : "text-danger"}">${salon.estado}</td>
        <td>${htmlImagenes}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarSalonAccion(${salon.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarSalonAccion(${salon.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}



document.getElementById("formSalon").addEventListener("submit", function (e) {
  e.preventDefault();
  const salones = JSON.parse(localStorage.getItem("salones")) || [];
   const imagenes = JSON.parse(localStorage.getItem("imagenes")) || [];

  const nuevoId = salones.length > 0 ? Math.max(...salones.map(s => s.id)) + 1 : 1;

  const nuevo = {
    id: nuevoId,
    titulo: document.getElementById("titulo").value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    valor: parseFloat(document.getElementById("valor").value),
    estado: document.getElementById("estado").value
  };

  if (!nuevo.titulo || !nuevo.direccion || !nuevo.descripcion || isNaN(nuevo.valor)) {
    alert("Completá todos los campos obligatorios.");
    return;
  }
  const nuevasImagenes = [];
    for (let i = 1; i <= 4; i++) { // asumimos 4 fotos por salón
      nuevasImagenes.push({
        idSalon: nuevoId,
        rutaArchivo: `img/salones/salon${nuevoId}/s${nuevoId}foto${i}.jpg`
      });
    }
  salones.push(nuevo);
  guardarEnLocalStorage("salones", salones);
  guardarEnLocalStorage("imagenes", imagenes.concat(nuevasImagenes));
  renderizarSalones();
  this.reset();
});

window.eliminarSalonAccion = (id) => eliminarSalon(id, renderizarSalones);
window.editarSalonAccion = (id) => editarSalon(id, renderizarSalones);

function renderizarServicios() {
  const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
  const tabla = document.getElementById("tabla-servicios");
  tabla.innerHTML = "";

  servicios.forEach((s) => {
    tabla.innerHTML += `
      <tr>
        <td>${s.nombre}</td>
        <td>${s.descripcion}</td>
        <td>$${s.valor}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarServicioAccion(${s.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarServicioAccion(${s.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

let editandoServicioId = null;

document.getElementById("formServicio").addEventListener("submit", function (e) {
  e.preventDefault();
  const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

   const nuevo = {
    id: editandoServicioId || Date.now(),
    nombre: document.getElementById("nombreServicio").value.trim(),
    descripcion: document.getElementById("descripcionServicio").value.trim(),
    valor: parseFloat(document.getElementById("valorServicio").value)
  };

  if (!nuevo.nombre || !nuevo.descripcion || isNaN(nuevo.valor)) {
    alert("Completá todos los campos.");
    return;
  }

  if (editandoServicioId) {
    const i = servicios.findIndex(s => s.id === editandoServicioId);
    servicios[i] = nuevo;
    editandoServicioId = null;
    document.getElementById("btnServicio").textContent = "Agregar servicio";
  } else {
    servicios.push(nuevo);
  }

  guardarEnLocalStorage("servicios", servicios);
  renderizarServicios();
  this.reset();
});

async function mostrarPresupuestos() {
  try {
    const presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];

    const [salonesRes, serviciosRes] = await Promise.all([
      fetch('../data/salones.json'),
      fetch('../data/servicios.json')
    ]);

    const salones = await salonesRes.json();
    const servicios = await serviciosRes.json();

    const tbody = document.querySelector("#tablaPresupuestos tbody");
    tbody.innerHTML = "";

    presupuestos.forEach(p => {
      const salon = salones.find(s => Number(s.id) === Number(p.idSalon));
      const nombresServicios = (p.servicios || []).map(s => s.nombre).join(", ");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.fecha}</td>
        <td>${salon ? salon.titulo : "Desconocido"}</td>
        <td>${nombresServicios}</td>
        <td>$${p.valorTotal}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error cargando presupuestos:", error);
  }
}

window.editarServicioAccion = (id) => editarServicio(id, renderizarServicios);
window.eliminarServicioAccion = (id) => eliminarServicio(id, renderizarServicios);

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "../login.html";
});









function cargarPresupuestos() {
  const tabla = document.getElementById("tabla-presupuestos");
  const presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];
  tabla.innerHTML = "";

  presupuestos.forEach(p => {
    const serviciosTexto = p.servicios.map(s => s.nombre).join(", ");

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.fecha}</td>
      <td>${p.salon?.titulo || "No definido"}</td>
      <td>${serviciosTexto}</td>
      <td>$${p.valorTotal}</td>
      <td>
        <button class="btn btn-danger btn-sm eliminar" data-id="${p.id}">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  
  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.currentTarget.dataset.id);
      eliminarPresupuesto(id);
    });
  });
}

function eliminarPresupuesto(id) {
  if (!confirm("¿Seguro que querés eliminar este presupuesto?")) return;

  let presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];
  presupuestos = presupuestos.filter(p => p.id !== id);
  localStorage.setItem("presupuestos", JSON.stringify(presupuestos));

  cargarPresupuestos(); 
}

document.addEventListener("DOMContentLoaded", cargarPresupuestos);



