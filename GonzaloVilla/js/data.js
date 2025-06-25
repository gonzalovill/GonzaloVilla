export const salonesIniciales = [
  {
    id: 1,
    nombre: "WISHLAND",
    direccion: "San Luis 1940",
    descripcion: "Un mundo de fantasía pensado para los más pequeños. Wishland ofrece un entorno seguro, colorido y acogedor donde los niños pueden jugar, explorar y divertirse en un ambiente mágico lleno de ternura.",
    imagenes: [
      "img/salones/salon1/s1foto1.jpeg",
      "img/salones/salon1/s1foto2.jpeg",
      "img/salones/salon1/s1foto3.jpeg",
      "img/salones/salon1/s1foto4.jpeg"
    ]
  },
  {
    id: 2,
    nombre: "UPPA",
    direccion: "Estrada 1315",
    descripcion:"Un salón moderno y tecnológico, ideal para los chicos más curiosos. Uppa combina juegos interactivos, pantallas touch y desafíos digitales para que tengan una experiencia innovadora, creativa y súper divertida.",
    imagenes: [
      "img/salones/salon2/s2foto1.jpeg",
      "img/salones/salon2/s2foto2.jpeg",
      "img/salones/salon2/s2foto3.jpeg",
      "img/salones/salon2/s2foto4.jpeg"
    ]
  },
  {
    id: 3,
    nombre: "CIUDAD MÁGICA",
    direccion: "Belgrano 2110",
    descripcion: "Ciudad Mágica cuenta con salones temáticos diferentes para que los niños se sumerjan en su historia favorita mientras festejan.",
    imagenes: [
      "img/salones/salon3/s3foto1.jpeg",
      "img/salones/salon3/s3foto2.jpeg",
      "img/salones/salon3/s3foto3.jpeg",
      "img/salones/salon3/s3foto4.jpeg"
    ]
  },
  {
    id: 4,
    nombre: "RECREO",
    direccion: "Champagnat 1090",
    descripcion: "Diversión asegurada bajo techo. Recreo ofrece un gran pelotero, inflables y juegos para todas las edades en un ambiente cerrado y cómodo.",
    imagenes: [
      "img/salones/salon4/s4foto1.jpeg",
      "img/salones/salon4/s4foto2.jpeg",
      "img/salones/salon4/s4foto3.jpeg",
      "img/salones/salon4/s4foto4.jpeg"
    ]
  }
];

export function inicializarSalones() {
  const salonesGuardados = JSON.parse(localStorage.getItem("salones"));
  if (!salonesGuardados || !Array.isArray(salonesGuardados) || salonesGuardados.length === 0) {
    localStorage.setItem("salones", JSON.stringify(salonesIniciales));
  }
}



export async function mostrarServiciosEnIndex() {
  try {
    const res = await fetch('data/servicios.json');
    const servicios = await res.json();
    
    const destacados = servicios.filter(s => s.estado === 'activo').slice(0, 3);
    const contenedor = document.getElementById('servicios-index');
    destacados.forEach(servicio => {
      contenedor.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${servicio.nombre}</h5>
              <p class="card-text">${servicio.descripcion}</p>
              <p class="mb-1"><strong>Valor:</strong> $${servicio.valor}</p>
              <span class="text-success fw-bold">Disponible</span>
            </div>
          </div>
        </div>
      `;
    });
  } catch (e) {
    
  }
}

export function inicializarServicios() {
  const serviciosExistentes = localStorage.getItem("servicios");

  if (!serviciosExistentes) {
    const serviciosIniciales = [
      {
        id: 1,
        nombre: "Animador",
        descripcion: "Animación con juegos y música.",
        valor: 1500,
        estado: "activo"
      },
      {
        id: 2,
        nombre: "Catering",
        descripcion: "Servicio completo de comidas y bebidas.",
        valor: 3500,
        estado: "activo"
      }
    ];
    localStorage.setItem("servicios", JSON.stringify(serviciosIniciales));
  }
}