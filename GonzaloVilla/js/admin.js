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
      <td>${salon.imagenes.map(img => `<img src="${img}" style="width: 50px; margin-right: 5px;">`).join("")}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarSalonAccion(${salon.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarSalonAccion(${salon.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.eliminarSalonAccion = (id) => eliminarSalon(id, salones, guardarEnLocalStorage, renderTabla);
window.editarSalonAccion = (id) => editarSalon(id, salones, guardarEnLocalStorage, renderTabla);

renderTabla();

