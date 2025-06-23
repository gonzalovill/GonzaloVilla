document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("usuarios-container");

  try {
    const res = await fetch("https://dummyjson.com/users");
    const data = await res.json();

    if (!res.ok) {
      container.textContent = "Error al cargar los usuarios.";
      return;
    }

    // Data tiene un array 'users'
    const usuarios = data.users;

// Crear tabla para mostrar usuarios (sin datos sensibles)
const tabla = document.createElement("table");

// Clases Bootstrap
tabla.className = "table table-bordered table-striped";
tabla.style.width = "100%";

// Encabezado
const header = tabla.createTHead();
header.className = "table-dark"; // fondo oscuro para el header
const headerRow = header.insertRow();

["Nombre", "Usuario", "Email", "Rol"].forEach(texto => {
  const th = document.createElement("th");
  th.textContent = texto;
  headerRow.appendChild(th);
});

// Cuerpo de tabla
const tbody = tabla.createTBody();

usuarios.forEach(user => {
  const row = tbody.insertRow();

  const nombreCompleto = `${user.firstName} ${user.lastName}`;
  row.insertCell().textContent = nombreCompleto;
  row.insertCell().textContent = user.username;
  row.insertCell().textContent = user.email;
  row.insertCell().textContent = user.role || "usuario";
});

// Insertar tabla en el contenedor
const container = document.getElementById("usuarios-container");
container.className = "table-responsive"; // por si no lo tenías
container.innerHTML = ""; // limpiar antes de insertar
container.appendChild(tabla);


  } catch (error) {
    container.textContent = "Error al cargar los usuarios.";
    console.error(error);
  }
});
