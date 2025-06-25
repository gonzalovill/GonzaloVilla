document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("accessToken");


  if (!token || !usuario) {
    window.location.href = "../login.html";
    return;
  }

  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

  if (usuario.role !== "admin") {
    alert("Solo administradores pueden acceder al panel.");
    window.location.href = "../catalogo.html";
  }
  
  console.log("Usuario admin validado:", usuario);

});



import { inicializarSalones } from './data.js';
import { eliminarSalon, editarSalon } from './acciones.js';

inicializarSalones();
let salones = JSON.parse(localStorage.getItem('salones')) || [];

const form = document.getElementById('formSalon');
const tabla = document.getElementById('tabla-salones');

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nuevoSalon = {
    id: Date.now(),
    nombre: document.getElementById("nombre").value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    imagenes: [
      document.getElementById("imagen1").value,
      document.getElementById("imagen2").value,
      document.getElementById("imagen3").value,
      document.getElementById("imagen4").value
    ].filter(url => url.trim() !== "")
  };

  if (!nuevoSalon.nombre || !nuevoSalon.direccion || !nuevoSalon.descripcion) {
    alert("Por favor completá todos los campos obligatorios.");
    return;
  }

  salones.push(nuevoSalon);
  guardarEnLocalStorage(salones);
  renderTabla();
  form.reset();
});

function guardarEnLocalStorage(data) {
  localStorage.setItem("salones", JSON.stringify(data));
  salones = data;
}

function renderTabla(data = salones) {
  tabla.innerHTML = "";
  data.forEach((salon) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${salon.nombre}</td>
      <td>${salon.direccion}</td>
      <td>${salon.descripcion}</td>
      <td>${salon.imagenes.map(img => `<img src="../${img}" style="width: 50px; margin-right: 5px;">`).join("")}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarSalonAccion(${salon.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarSalonAccion(${salon.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("accessToken");
  window.location.href = "../login.html";
});

window.eliminarSalonAccion = (id) => eliminarSalon(id, salones, guardarEnLocalStorage, renderTabla);
window.editarSalonAccion = (id) => editarSalon(id, salones, guardarEnLocalStorage, renderTabla);

renderTabla();

let servicios = [];
let editandoServicioId = null;


async function cargarServicios() {
  const guardados = localStorage.getItem('servicios');
  if (guardados) {
    servicios = JSON.parse(guardados);
  } else {
    const res = await fetch('../data/servicios.json');
    servicios = await res.json();
    localStorage.setItem('servicios', JSON.stringify(servicios));
  }
  renderizarServicios();
}

function guardarServicios() {
  localStorage.setItem('servicios', JSON.stringify(servicios));
}

function renderizarServicios() {
  const tbody = document.getElementById('tabla-servicios');
  tbody.innerHTML = '';
  servicios.forEach((servicio) => {
    const estadoClass = servicio.estado === 'activo' ? 'text-success' : 'text-danger';
    tbody.innerHTML += `
      <tr>
        <td>${servicio.nombre}</td>
        <td>${servicio.descripcion}</td>
        <td>${servicio.valor}</td>
        <td class="${estadoClass}">${servicio.estado.charAt(0).toUpperCase() + servicio.estado.slice(1)}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarServicio(${servicio.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarServicio(${servicio.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}


document.getElementById('formServicio').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombreServicio').value;
  const descripcion = document.getElementById('descripcionServicio').value;
  const valor = document.getElementById('valorServicio').value;
  const estado = document.getElementById('estadoServicio').value;

  if (editandoServicioId) {
    
    const servicio = servicios.find(s => s.id === editandoServicioId);
    servicio.nombre = nombre;
    servicio.descripcion = descripcion;
    servicio.valor = valor;
    servicio.estado = estado;
    editandoServicioId = null;
    document.getElementById('btnServicio').textContent = "Agregar servicio";
  } else {
    
    const nuevoServicio = {
      id: Date.now(),
      nombre,
      descripcion,
      valor,
      estado
    };
    servicios.push(nuevoServicio);
  }
  guardarServicios();
  renderizarServicios();
  this.reset();
});


window.eliminarServicio = function(id) {
  if (confirm("¿Seguro que deseas eliminar este servicio?")) {
    servicios = servicios.filter(s => s.id !== id);
    guardarServicios();
    renderizarServicios();
  }
};


window.editarServicio = function(id) {
  const servicio = servicios.find(s => s.id === id);
  if (!servicio) return;
  document.getElementById('nombreServicio').value = servicio.nombre;
  document.getElementById('descripcionServicio').value = servicio.descripcion;
  document.getElementById('valorServicio').value = servicio.valor;
  document.getElementById('estadoServicio').value = servicio.estado;
  editandoServicioId = id;
  document.getElementById('btnServicio').textContent = "Guardar cambios";
};

document.addEventListener('DOMContentLoaded', cargarServicios);
