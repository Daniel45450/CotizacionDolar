
async function obtenerPrecios() {
    const url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
    try {
        let res = await fetch(url);
        let datos = await res.json();
        return datos;
    } catch (error) {
        console.log(error);
    }
}

async function procesadarDatos() {
    const datos = await obtenerPrecios();
    
    datos.forEach( (element, index) => {
        let bloque = document.createElement('DIV');
        let titulo = document.createElement('H2');
        let contenido = document.createElement('DIV');
        let compra = document.createElement('P');
        let venta = document.createElement('P');

        titulo.classList.add('bloque__titulo');
        titulo.textContent = element.casa.nombre;

        compra.innerHTML = `Compra <span class="bloque__precio"> ${formatearPrecio(element.casa.compra)}</span>`;
        venta.innerHTML = `Venta <span class="bloque__precio"> ${formatearPrecio(element.casa.venta)} </span>`;

        contenido.classList.add('bloque__contenido');
        contenido.appendChild(compra);
        contenido.appendChild(venta);

        bloque.classList.add('bloque');

        bloque.appendChild(titulo);
        bloque.appendChild(contenido);

        document.querySelector('.bloques').appendChild(bloque);
    });
    console.log('datos cargados');
}

function formatearPrecio(precio) {
    let precioFormateado = parseFloat(precio).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'          
    })    
    return precioFormateado;
}

procesadarDatos();
//document.addEventListener('DOMContentLoaded', setInterval( function() {console.log('asd')}, 5000));

//document.addEventListener('DOMContentLoaded', setInterval(procesadarDatos(), 5000));
