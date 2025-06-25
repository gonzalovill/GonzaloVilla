document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("usuarios-container");

  try {
    const res = await fetch("https://dummyjson.com/users");
    const data = await res.json();

    if (!res.ok) {
      container.textContent = "Error al cargar los usuarios.";
      return;
    }

const usuarios = data.users;
const tabla = document.createElement("table");

tabla.className = "table table-bordered table-striped";
tabla.style.width = "100%";
const header = tabla.createTHead();
header.className = "table-dark"; 
const headerRow = header.insertRow();

["Nombre", "Usuario", "Email", "Rol"].forEach(texto => {
  const th = document.createElement("th");
  th.textContent = texto;
  headerRow.appendChild(th);
});

const tbody = tabla.createTBody();

usuarios.forEach(user => {
  const row = tbody.insertRow();

  const nombreCompleto = `${user.firstName} ${user.lastName}`;
  row.insertCell().textContent = nombreCompleto;
  row.insertCell().textContent = user.username;
  row.insertCell().textContent = user.email;
  row.insertCell().textContent = user.role || "usuario";
});

const container = document.getElementById("usuarios-container");
container.className = "table-responsive"; 
container.innerHTML = ""; 
container.appendChild(tabla);


  } catch (error) {
    container.textContent = "Error al cargar los usuarios.";
    console.error(error);
  }
});
