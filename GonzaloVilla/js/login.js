document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg.textContent = "Usuario o contraseña incorrectos.";
        errorMsg.style.display = "block";
        return;
      }

      const userRes = await fetch(`https://dummyjson.com/users/${data.id}`);
      const userData = await userRes.json();

      sessionStorage.setItem("accessToken", data.token);
      sessionStorage.setItem("usuarioLogueado", JSON.stringify(userData));

      window.location.href = "admin/admin.html";

    } catch (err) {
      console.error("Error en login:", err);
      errorMsg.textContent = "Error de conexión. Intente nuevamente.";
      errorMsg.style.display = "block";
    }
  });
});



