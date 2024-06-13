
// import clienteAxios from './axios2.js';

//axios sesion
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
      alert("Registro exitoso"); 
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
      localStorage.setItem("AUTH_TOKEN", response.data.access_token);  //token
      console.log("Inicio de sesión exitoso:", response.data);
      console.log("Su codigo token:", response.data.access_token);
      // Redirigir a la página principal u otra página
      window.location.href = "../index.html";
    //   window.history.replaceState({}, "", "index.html"); // Navegar a index.html sin recargar la página
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
//axios sesion

// Función para obtener la información del usuario
 



///-----



let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
}


///////CARRO COMPRA

let iconCart = document.querySelector('.icon-cart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', function(){
    if(cart.style.right == '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', function(){
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});


  


///////////////DOM LLAMANDO A AXIOS----------------------------------
let listaActividades = document.querySelector('#destination');

let carroArray = obtenerCarritoLS() || [];

// localStorage.clear();

document.addEventListener('DOMContentLoaded', main); //////si borrar o no esto




  async function main() {

    // const token = localStorage.getItem("AUTH_TOKEN");
    // if (!token) {
    //     window.location.href = "login.html";
    //     return;
    // }

    try {
        const response = await clienteAxios.get('/api/actividades', {
          
            headers: {
                Authorization: `Bearer ${token}`,
                
            }, 
        });
        console.log(response);
        const arrayActividades = response.data;
        const arrAct2Dim = convertirArray2Dim(arrayActividades, 3);
        impObjetos(arrAct2Dim);

        let listaActividades = document.querySelector('#destination');
        listaActividades.addEventListener('click', e => {
            const elemento = e.target;
            if (elemento.classList.contains('agregar-carrito')) {
                const id = elemento.getAttribute('data-id');
                addCarrito(arrayActividades, id);
            }

            if (elemento.classList.contains('borrar-actividad')) {
                const id = elemento.getAttribute('data-id');
                eliminarActividad(id);
            }
        });

        document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
    } catch (error) {
        console.error('Error obteniendo los datos:', error);
        window.location.href = "login.html";
    }
}


function obtenerCarritoLS() {
        const carroJSON = localStorage.getItem('carroArray');
        return carroJSON ? JSON.parse(carroJSON) : [];
    }


function guardarCarritoLS(carroArray) {
        localStorage.setItem('carroArray', JSON.stringify(carroArray));
    }


function convertirArray2Dim(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}



function impObjetos(array2D){
    const container2 =  document.createElement('div');
    container2.classList.add('box-container');

       
    array2D.forEach(fila => {
       
        fila.forEach((act) => {
          
            container2.innerHTML += `
            
                    <div class="box">
                        <div class="image">
                            <img src="${act.src}" class="imagen-act" width="100px" height="100px"/>
                        </div>
           
                        <div class="content">
                            <h3>${act.titulo}</h3>
                            <p>Lore ispum nuionuicn webejinc</p>
                            <h3>${act.precio}</h3>
                            <a href="#" class="agregar-carrito" data-id="${act.id}">Agregar Al Carrito<i class="fas fa-angle-right"></i></a>
                        </div>
                    </div>
             
            `;
           
          });
        
    })
    listaActividades.appendChild(container2);
}


function addCarrito(arrayAct, id) {
    const actSeleccionado = arrayAct.find(act => act.id === id);
    const existe = carroArray.find(item => item.id === id);


    if (actSeleccionado){
        if (existe) {
            existe.cantidad++;
        } else {
            carroArray.push({ ...actSeleccionado, cantidad: 1});//Spread operator
        }//Se crea un objeto con un copia-pega de cursoSeleccionado, y se le agrega la cantidad como propiedad
   
        actualizarVisualizacionCarrito();
        guardarCarritoLS();
    }
}


function eliminarActividad(id) {
    const actSeleccionadoIndex = carroArray.findIndex(item => item.id === id);
   
    if (actSeleccionadoIndex !== -1){
        const actSeleccionado = carroArray[actSeleccionadoIndex];
   
        if (actSeleccionado.cantidad > 1) {
            // Si hay más de un curso del mismo tipo,  reducimos la cantidad
            actSeleccionado.cantidad--;
        } else {
            // Si hay solo uno, eliminamos el curso
            carroArray.splice(actSeleccionadoIndex, 1);
        }
        actualizarVisualizacionCarrito();
        guardarCarritoLS();
    }
}

function vaciarCarrito() {
    carroArray = [];
    actualizarVisualizacionCarrito();
    guardarCarritoLS(carroArray);
}


function actualizarVisualizacionCarrito() {

    //////PRUEBA
    const listaCarrito = document.querySelector('.list-cart');
    listaCarrito.innerHTML = '';

    carroArray.forEach(objeto => {
        const divItem = document.createElement('div');
        divItem.classList.add('item');

        // Crear el elemento para el nombre del ítem
        const divNombre = document.createElement('div');
        divNombre.classList.add('name');
        divNombre.textContent = objeto.titulo;

        // Crear el elemento para el precio del ítem
        const divPrecio = document.createElement('div');
        divPrecio.classList.add('price');
        divPrecio.textContent = `$${objeto.precio}`;

        const divCantidad = document.createElement('div');
        divCantidad.classList.add('quantity');
        divCantidad.textContent = `cantidad ${objeto.cantidad}`;

        //Eliminar 
        const divEliminar = document.createElement('div');
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('borrar-actividad');
        btnEliminar.setAttribute('data-id', objeto.id);
        
        
        btnEliminar.addEventListener('click', function() {
            eliminarActividad(objeto.id);
        });

        divEliminar.appendChild(btnEliminar);


        // Agregar los elementos al contenedor del ítem
        divItem.appendChild(divNombre);
        divItem.appendChild(divPrecio);
        divItem.appendChild(divEliminar);
        divItem.appendChild(divCantidad);

        // Agregar el ítem a la lista del carrito
        listaCarrito.appendChild(divItem);
    });


}


/////IMP OBJS CARRO PRUEBA
function impObjetosCarro(carroArray) {
    console.log("Agregandose al carro...")
    const listaCarrito = document.querySelector('.list-cart');
    listaCarrito.innerHTML = ''; // Limpiar la lista de carrito existente

    carroArray.forEach(objeto => {
        // Crear el contenedor del ítem
        const divItem = document.createElement('div');
        divItem.classList.add('item');

        // Crear el elemento para el nombre del ítem
        const divNombre = document.createElement('div');
        divNombre.classList.add('name');
        divNombre.textContent = objeto.titulo;

        // Crear el elemento para el precio del ítem
        const divPrecio = document.createElement('div');
        divPrecio.classList.add('price');
        divPrecio.textContent = `$${objeto.precio}`;

        // Crear el elemento para la cantidad del ítem
        const divCantidad = document.createElement('div');
        divCantidad.classList.add('quantity');
        divCantidad.textContent = `Cantidad: ${objeto.cantidad}`;

        // Crear el botón de eliminar
        const divEliminar = document.createElement('div');
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('borrar-actividad');
        btnEliminar.setAttribute('data-id', objeto.id);
        btnEliminar.addEventListener('click', function() {
            eliminarDelCarrito(objeto.id); // Asumimos que hay una función para eliminar el ítem del carrito
        });

        divEliminar.appendChild(btnEliminar);

        // Agregar los elementos al contenedor del ítem
        divItem.appendChild(divNombre);
        divItem.appendChild(divPrecio);
        divItem.appendChild(divCantidad);
        divItem.appendChild(divEliminar);
        console.log("carrito de la compra");
        console.log(divItem);

        // Agregar el ítem a la lista del carrito
        listaCarrito.appendChild(divItem);
    });
}




///////////////DOM LLAMANDO A AXIOS----------------------------


////////////////DOM NORMAL---------------------------------------------------
// let listaActividades = document.querySelector('#destination');

// let carroArray = obtenerCarritoLS() || [];

// localStorage.clear();

// La unica forma de resetear todo de una es actualizar la pag, ya que con un botón no se pudo


//    FUNCION MAIN---------------------


// async function main() {
//     const arrayActividades = await obtenerObjetosJSON();
//     console.log(arrayActividades);
//     const arrAct2Dim = convertirArray2Dim(arrayActividades, 3);
//     console.log("este");
//     console.log(arrAct2Dim);
//     impObjetos(arrAct2Dim);


//     //EVENTOS
//     listaActividades.addEventListener('click', e =>{
//         console.log("llego al evento");
//         console.log(e.target);
//         const elemento = e.target;


//         //Si se agrega al carrito
//         if(elemento.classList.contains('agregar-carrito')){

//             const id = elemento.getAttribute('data-id');
//             console.log("data id");
//             console.log(id);
//             addCarrito(arrayActividades, id);
           
//         }
//         console.log(carroArray);


//         if (elemento.classList.contains('borrar-actividad')) {
//             const id = elemento.getAttribute('data-id');
//             eliminarActividad(id);
//         }


//     });


//     document.getElementById('vaciar-carrito').addEventListener('click', () => {
//         vaciarCarrito();
//     });
   
// }


// //FUNCIONES DEL CARRO----------------------


// function obtenerCarritoLS() {
//     const carroJSON = localStorage.getItem('carroArray');
//     return carroJSON ? JSON.parse(carroJSON) : null;
// }



// function guardarCarritoLS() {
//     localStorage.setItem('carroArray', JSON.stringify(carroArray));
// }



// async function obtenerObjetosJSON(){ //Obtiene el objeto json y lo devuelve a array
//     const RESPUESTA = await fetch('./data/objetos.json');
//     const RESPUESTAJSON = await RESPUESTA.json();
//     console.log(RESPUESTAJSON);
//     let objetoArray = [];


//     RESPUESTAJSON.forEach(objeto => {
//         objetoArray.push(objeto);
//     })
//     return objetoArray;
// }





// function convertirArray2Dim(array, numColumns) { //Convierte en un array 2d tomando el array y el numero de columnas
//     const resultadoArray = [];

//     for (let i = 0; i<array.length; i += numColumns){
//         const fila = array.slice(i, i + numColumns);
//         resultadoArray.push(fila);
//     }
//     return resultadoArray;
// }




// function objetoDesdeJson(objeto) {
//     //Separo los elementos del objeto en pares de clave-valor
//     const elementos = Object.entries(objeto);
//     //Construyo un nuevo objeto a partir de los pares de clave-valor obtenidos
//     const objetoNuevo = Object.fromEntries(elementos);
//     return objetoNuevo;
// }





// function impObjetos(array2D){
//     const container2 =  document.createElement('div');
//     container2.classList.add('box-container');

       
//     array2D.forEach(fila => {
       
//         fila.forEach((act) => {
          
//             container2.innerHTML += `
            
//                     <div class="box">
//                         <div class="image">
//                             <img src="${act.src}" class="imagen-act" width="100px" height="100px"/>
//                         </div>
           
//                         <div class="content">
//                             <h3>${act.titulo}</h3>
//                             <p>Lore ispum nuionuicn webejinc</p>
//                             <h3>${act.precio}</h3>
//                             <a href="#" class="agregar-carrito" data-id="${act.id}">Agregar Al Carrito<i class="fas fa-angle-right"></i></a>
//                         </div>
//                     </div>
             
//             `;
           
//           });
        
//     })
//     listaActividades.appendChild(container2);
// }



// function addCarrito(arrayAct, id) {
//     const actSeleccionado = arrayAct.find(act => act.id === id);
//     const existe = carroArray.find(item => item.id === id);


//     if (actSeleccionado){
//         if (existe) {
//             existe.cantidad++;
//         } else {
//             carroArray.push({ ...actSeleccionado, cantidad: 1});//Spread operator
//         }//Se crea un objeto con un copia-pega de cursoSeleccionado, y se le agrega la cantidad como propiedad
   
//         actualizarVisualizacionCarrito();
//         guardarCarritoLS();
//     }
// }


// function eliminarActividad(id) {
//     const actSeleccionadoIndex = carroArray.findIndex(item => item.id === id);
   
//     if (actSeleccionadoIndex !== -1){
//         const actSeleccionado = carroArray[actSeleccionadoIndex];
   
//         if (actSeleccionado.cantidad > 1) {
//             // Si hay más de un curso del mismo tipo,  reducimos la cantidad
//             actSeleccionado.cantidad--;
//         } else {
//             // Si hay solo uno, eliminamos el curso
//             carroArray.splice(actSeleccionadoIndex, 1);
//         }
//         actualizarVisualizacionCarrito();
//         guardarCarritoLS();
//     }
// }


// function vaciarCarrito() {
//     carroArray = [];
//     actualizarVisualizacionCarrito();
//     guardarCarritoLS();
// }



// function actualizarVisualizacionCarrito() {

//     //////PRUEBA
//     const listaCarrito = document.querySelector('.list-cart');
//     listaCarrito.innerHTML = '';

//     carroArray.forEach(objeto => {
//         const divItem = document.createElement('div');
//         divItem.classList.add('item');

//         // Crear el elemento para el nombre del ítem
//         const divNombre = document.createElement('div');
//         divNombre.classList.add('name');
//         divNombre.textContent = objeto.titulo;

//         // Crear el elemento para el precio del ítem
//         const divPrecio = document.createElement('div');
//         divPrecio.classList.add('price');
//         divPrecio.textContent = `$${objeto.precio}`;

//         const divCantidad = document.createElement('div');
//         divCantidad.classList.add('quantity');
//         divCantidad.textContent = `cantidad ${objeto.cantidad}`;

//         //Eliminar 
//         const divEliminar = document.createElement('div');
//         const btnEliminar = document.createElement('button');
//         btnEliminar.textContent = 'Eliminar';
//         btnEliminar.classList.add('borrar-actividad');
//         btnEliminar.setAttribute('data-id', objeto.id);
        
        
//         btnEliminar.addEventListener('click', function() {
//             eliminarActividad(objeto.id);
//         });

//         divEliminar.appendChild(btnEliminar);


//         // Agregar los elementos al contenedor del ítem
//         divItem.appendChild(divNombre);
//         divItem.appendChild(divPrecio);
//         divItem.appendChild(divEliminar);
//         divItem.appendChild(divCantidad);

//         // Agregar el ítem a la lista del carrito
//         listaCarrito.appendChild(divItem);
//     });


// }


// /////IMP OBJS CARRO PRUEBA
// function impObjetosCarro(carroArray) {
//     console.log("Agregandose al carro...")
//     const listaCarrito = document.querySelector('.list-cart');
//     listaCarrito.innerHTML = ''; // Limpiar la lista de carrito existente

//     carroArray.forEach(objeto => {
//         // Crear el contenedor del ítem
//         const divItem = document.createElement('div');
//         divItem.classList.add('item');

//         // Crear el elemento para el nombre del ítem
//         const divNombre = document.createElement('div');
//         divNombre.classList.add('name');
//         divNombre.textContent = objeto.titulo;

//         // Crear el elemento para el precio del ítem
//         const divPrecio = document.createElement('div');
//         divPrecio.classList.add('price');
//         divPrecio.textContent = `$${objeto.precio}`;

//         // Crear el elemento para la cantidad del ítem
//         const divCantidad = document.createElement('div');
//         divCantidad.classList.add('quantity');
//         divCantidad.textContent = `Cantidad: ${objeto.cantidad}`;

//         // Crear el botón de eliminar
//         const divEliminar = document.createElement('div');
//         const btnEliminar = document.createElement('button');
//         btnEliminar.textContent = 'Eliminar';
//         btnEliminar.classList.add('borrar-actividad');
//         btnEliminar.setAttribute('data-id', objeto.id);
//         btnEliminar.addEventListener('click', function() {
//             eliminarDelCarrito(objeto.id); // Asumimos que hay una función para eliminar el ítem del carrito
//         });

//         divEliminar.appendChild(btnEliminar);

//         // Agregar los elementos al contenedor del ítem
//         divItem.appendChild(divNombre);
//         divItem.appendChild(divPrecio);
//         divItem.appendChild(divCantidad);
//         divItem.appendChild(divEliminar);
//         console.log("carrito de la compra");
//         console.log(divItem);

//         // Agregar el ítem a la lista del carrito
//         listaCarrito.appendChild(divItem);
//     });
// }
/////FIN PRUEBA



main();

///////////////----------------///////////


//FUNCION CARROUSEL


const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');

let currentIndex = 0;

function updateSlideWidth() {
  return slides[0].clientWidth;
}

function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;
  const slideWidth = updateSlideWidth();
  slider.style.transform = `translateX(-${index * slideWidth}px)`;
  currentIndex = index;
}

goToSlide(0);

window.addEventListener('resize', () => {
  goToSlide(currentIndex);
});

document.getElementById('prev').addEventListener('click', () => {
  console.log("Moviendose");
  goToSlide(currentIndex - 1);
});

document.getElementById('next').addEventListener('click', () => {
  console.log("Moviendose");
  goToSlide(currentIndex + 1);
});




///Nuevo???



///////////////////´---------MODAL 

//VARIABLES

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

//FUNCIONES

//Para las variables funciones primero

const openModal = function () {

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    console.log("Abriendose");
}


const closeModal = function () {  
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}


//EVENTOS

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});
   
 