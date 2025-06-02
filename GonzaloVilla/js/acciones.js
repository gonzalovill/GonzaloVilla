export function eliminarSalon(id, salones, guardar, render) {
  if (confirm("¿Estás seguro de eliminar este salón?")) {
    const nuevosSalones = salones.filter(s => s.id !== id);
    guardar(nuevosSalones);
    render(nuevosSalones);
  }
}

export function editarSalon(id, salones, guardarEnLocalStorage, renderTabla) {
  const salon = salones.find(s => s.id === id);
  if (!salon) return;

  const nuevoNombre = prompt("Editar nombre:", salon.nombre) || salon.nombre;
  const nuevaDireccion = prompt("Editar dirección:", salon.direccion) || salon.direccion;
  const nuevaDescripcion = prompt("Editar descripción:", salon.descripcion) || salon.descripcion;

  const nuevasImagenes = [];
  for (let i = 0; i < 4; i++) {
    const urlActual = salon.imagenes[i] || "";
    const nuevaURL = prompt(`Editar imagen ${i + 1}:`, urlActual);
    if (nuevaURL && nuevaURL.trim() !== "") {
      nuevasImagenes.push(nuevaURL.trim());
    }
  }
  salon.nombre = nuevoNombre;
  salon.direccion = nuevaDireccion;
  salon.descripcion = nuevaDescripcion;
  salon.imagenes = nuevasImagenes;

  guardarEnLocalStorage(salones);
  renderTabla();
}
