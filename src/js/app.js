
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

        let nombre = element.casa.nombre;
        titulo.classList.add('bloque__titulo');
        titulo.textContent = nombre;

        let precioCompra = formatearPrecio(element.casa.compra);
        let precioVenta = formatearPrecio(element.casa.venta);

        nombre = nombre.replace(/ /g,'');
        venta.id = nombre.toLowerCase(); 
        compra.innerHTML = `Compra <span class="bloque__precio"> ${precioCompra}</span>`;
        venta.innerHTML = `Venta <span class="bloque__precio"> ${precioVenta} </span>`;

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
    precio = precio.replace(".", "");
    precio = precio.replace(",", ".");
    precio = Number(precio);

    let precioFormateado;
    
    if(isNaN(precio)) {
        precioFormateado = "No cotiza";
    } else {
        precioFormateado = Number(precio).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS'          
        })   
    }
 
    return precioFormateado;
}

function darkMode() {

    const prefersDarkMode = window.matchMedia("(prefers-color-scheme:dark)").matches;
    if(prefersDarkMode) {
        document.querySelector('body').classList.add('darkmode');
    }
    
    const icono = document.querySelector('.darkmode__icon');
    icono.addEventListener('click', () => { 

        const darkmode = document.querySelector('body').classList.contains('darkmode');
        if(darkMode) {
            document.querySelector('body').classList.toggle('darkmode');
        } else {
            document.querySelector('body').classList.toggle('darkmode');          
        }
    });
}

function calculadora() {
    const btn = document.querySelector('.btn-calculadora');
    btn.addEventListener('click', ()=> {
        const errores = [];
        let cantidad = document.querySelector('#moneda').value;
        if(cantidad === "") {
            errores.push('Debes introducir una cantidad');
        } else {
            cantidad = parseInt(document.querySelector('#moneda').value);
            if(cantidad <= 0) {
                errores.push('Debes introducir un cantidad mayor a 0');                
            }
        }
        const opcionSeleccionada = parseInt(document.querySelector('#convertidorOpciones').selectedIndex);
        const precio = parseInt(document.querySelector('#dolarblue').textContent.split('$')[1]);
        if(opcionSeleccionada === 0) {
            errores.push('Selecciona una opcion valida');
        }
        if(errores.length === 0) {
            const resultado = document.querySelector('#resultado_total');
            let operacion = 0;
            if(opcionSeleccionada === 1) {
                operacion = cantidad / precio;
                resultado.textContent = `${cantidad} Pesos son ${formatearPrecio(operacion)} Dolares`;
            } else {
                operacion = cantidad * precio;
                resultado.textContent = `${cantidad} Dolares son ${formatearPrecio(operacion)} Pesos`;                
            }

            const conteResultado = document.querySelector('.resultado');
            conteResultado.style.display = 'block';

            eliminarResultado = () => {
                conteResultado.style.display = 'none';
                document.querySelector('#moneda').value = '';
                const opciones = document.querySelector('#convertidorOpciones');
                opciones.options[0].selected = true; 

            }

            setTimeout(eliminarResultado,5000);
        } else {
            const contenedorErrores = document.querySelector('.contenedorErrores');
            console.log(errores.length);
            for(let i =0; i<errores.length; i++) {
                let p = document.createElement("P");
                p.classList.add('error');
                p.textContent = errores[i];
                contenedorErrores.appendChild(p);
            }

            contenedorErrores.style.display = "block";
            eliminarErrores = () => {
                document.querySelector('#moneda').value = '';
                const opciones = document.querySelector('#convertidorOpciones');
                opciones.options[0].selected = true; 
                contenedorErrores.innerHTML = "";
                contenedorErrores.style.display = "none";
            }

            setTimeout(eliminarErrores, 6000);
        }

    });
}

document.addEventListener('DOMContentLoaded', () => {
    procesadarDatos();
    darkMode();
    calculadora();
});

