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
  await cargardatosSinohay("imagenes", "imagenes.json");

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

  const nuevo = {
    id: Date.now(),
    titulo: document.getElementById("nombre").value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    valor: parseFloat(document.getElementById("valor").value),
    estado: document.getElementById("estado").value
  };

  if (!nuevo.titulo || !nuevo.direccion || !nuevo.descripcion || isNaN(nuevo.valor)) {
    alert("Completá todos los campos obligatorios.");
    return;
  }

  salones.push(nuevo);
  guardarEnLocalStorage("salones", salones);
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

window.editarServicioAccion = (id) => editarServicio(id, renderizarServicios);
window.eliminarServicioAccion = (id) => eliminarServicio(id, renderizarServicios);

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "../login.html";
});
