document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("No se encontró el formulario de login.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg.style.display = "block";
        return;
      }

      sessionStorage.setItem("accessToken", data.token);
      window.location.href = "./admin/admin.html";
    } catch (err) {
      console.error("Error en login:", err);
      errorMsg.style.display = "block";
    }
  });
});

