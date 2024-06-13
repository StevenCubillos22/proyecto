// import clienteAxios from './axios.js';



// Configuración de Axios
const clienteAxios = axios.create({
  baseURL: "http://localhost",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});



// Manejar el registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const datos = { name, email, password };

  try {
    const response = await clienteAxios.post("/api/register", datos);
    localStorage.setItem("AUTH_TOKEN", response.data.token);
    console.log("Registro exitoso:", response.data);
    // Redirigir a la página principal u otra página
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error en el registro:", error);
    mostrarErrores(error);
  }
});

// Manejar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const datos = { email, password };

  try {
    const response = await clienteAxios.post("/api/login", datos);
    localStorage.setItem("AUTH_TOKEN", response.data.token);
    console.log("Inicio de sesión exitoso:", response.data);
    // Redirigir a la página principal u otra página
    // window.location.href = "../index.html";
    window.history.replaceState({}, "", "index.html"); // Navegar a index.html sin recargar la página
    alert("Inicio de sesión exitoso"); 
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    mostrarErrores(error);
  }
});

// Función para mostrar errores
function mostrarErrores(error) {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.innerHTML = '';

  if (error.response && error.response.data.errors) {
    const errores = Object.values(error.response.data.errors);
    errores.forEach(err => {
      const p = document.createElement('p');
      p.textContent = err;
      errorContainer.appendChild(p);
    });
  } else {
    const p = document.createElement('p');
    p.textContent = 'Error inesperado. Inténtalo de nuevo más tarde.';
    errorContainer.appendChild(p);
  }
}




// export default clienteAxios;