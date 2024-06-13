document.addEventListener('DOMContentLoaded', mostrarCompras);


////
function obtenerComprasLS() {
    const comprasJSON = localStorage.getItem('compras');
    return comprasJSON ? JSON.parse(comprasJSON) : [];
}
////


function mostrarCompras() {
    const comprasArray = obtenerComprasLS();
    console.log("Compras obtenidas de LS:", comprasArray);
    const comprasContenido = document.getElementById('compras-contenido');

    comprasArray.forEach(item => {
        const actividadElement = document.createElement('div');
        actividadElement.classList.add('actividad');

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

        comprasContenido.appendChild(actividadElement);
    });
}
