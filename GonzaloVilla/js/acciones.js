export function eliminarSalon(id, renderTabla) {
  let salones = JSON.parse(localStorage.getItem('salones')) || [];
  if (confirm("¿Estás seguro de eliminar este salón?")) {
    const nuevosSalones = salones.filter(s => s.id !== id);
    localStorage.setItem("salones", JSON.stringify(nuevosSalones));
    renderTabla();
  }
}

export function editarSalon(id, renderTabla) {
  const salones = JSON.parse(localStorage.getItem("salones")) || [];
  const salon = salones.find(s => s.id === id);
  if (!salon) return;

  const nuevoTitulo = prompt("Editar título:", salon.titulo) || salon.titulo;
  const nuevaDireccion = prompt("Editar dirección:", salon.direccion) || salon.direccion;
  const nuevaDescripcion = prompt("Editar descripción:", salon.descripcion) || salon.descripcion;
  const nuevoValor = prompt("Editar valor:", salon.valor) || salon.valor;
  const nuevoEstado = prompt("Editar estado (Disponible o Reservado):", salon.estado) || salon.estado;

  salon.titulo = nuevoTitulo;
  salon.direccion = nuevaDireccion;
  salon.descripcion = nuevaDescripcion;
  salon.valor = parseFloat(nuevoValor);
  salon.estado = nuevoEstado;

  localStorage.setItem("salones", JSON.stringify(salones));
  renderTabla();
}

export function editarServicio(id, render) {
  const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
  const servicio = servicios.find(s => s.id === id);
  if (!servicio) return;

  const nuevoNombre = prompt("Editar nombre:", servicio.nombre) || servicio.nombre;
  const nuevaDescripcion = prompt("Editar descripción:", servicio.descripcion) || servicio.descripcion;
  const nuevoValor = prompt("Editar valor:", servicio.valor) || servicio.valor;
  
  servicio.nombre = nuevoNombre;
  servicio.descripcion = nuevaDescripcion;
  servicio.valor = parseFloat(nuevoValor);


  localStorage.setItem("servicios", JSON.stringify(servicios));
  render();
}

export function eliminarServicio(id, render) {
  let servicios = JSON.parse(localStorage.getItem("servicios")) || [];
  if (confirm("¿Estás seguro de eliminar este servicio?")) {
    servicios = servicios.filter(s => s.id !== id);
    localStorage.setItem("servicios", JSON.stringify(servicios));
    render();
  }
}
