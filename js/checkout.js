

///prueba 1
document.addEventListener('DOMContentLoaded', mostrarCarrito);

function obtenerCarritoLS() {
    const carroJSON = localStorage.getItem('carroArray');
    return carroJSON ? JSON.parse(carroJSON) : [];
}


/////
function guardarComprasLS(compras) {
    let comprasExistentes = obtenerComprasLS();
    comprasExistentes = comprasExistentes.concat(compras);
    localStorage.setItem('compras', JSON.stringify(comprasExistentes));
}
/////


////????
function obtenerComprasLS() {
    const comprasJSON = localStorage.getItem('compras');
    return comprasJSON ? JSON.parse(comprasJSON) : [];
}


////????



function comprar() {
    const carroArray = obtenerCarritoLS();
    if (carroArray.length > 0) {
        guardarComprasLS(carroArray);
        console.log("Compras guardadas en LS:", obtenerComprasLS());
        localStorage.removeItem('carroArray');
        window.location.href = 'index.html';
    } else {
        alert('No hay actividades en el carrito.');
    }
}


function mostrarCarrito() {
    const carroArray = obtenerCarritoLS();
    const carritoContenido = document.getElementById('carrito-contenido');
    const totalActividadesElement = document.getElementById('total-actividades');
    const precioTotalElement = document.getElementById('precio-total');
    
    let totalActividades = 0;
    let precioTotal = 0;

    console.log(carroArray);

    carroArray.forEach(item => {
        const actividadElement = document.createElement('div');
        actividadElement.classList.add('actividad');

        // Limpiar el precio para asegurarse de que sea un número válido
    const precioNumerico = parseFloat(item.precio.trim());
    console.log(typeof precioNumerico);


        actividadElement.innerHTML = `
            <div class="actividad-info">
                <img src="${item.src}" alt="${item.nombre}">
                <div class="content">
                    <h3>${item.titulo}</h3>
                    <p>${item.descripcion}</p>
                    <span class="price">Precio: ${item.precio}</span>
                     <span class="cantidad">Cantidad: ${item.cantidad}</span>
                </div>
            </div>
        `;

        carritoContenido.appendChild(actividadElement);
        
        totalActividades = totalActividades + item.cantidad;
        precioTotal += precioNumerico * item.cantidad;
    });

    totalActividadesElement.textContent = totalActividades;
     precioTotalElement.textContent = `${precioTotal.toFixed(2)} €`;

    //manejo funcion comprar carro compra
     document.getElementById('comprar-btn').addEventListener('click', () => {
        comprar();
    });
     
}

////

