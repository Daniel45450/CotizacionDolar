class Cotizacion {

    nombre = "";
    precio_compra = 0;
    precio_venta = 0;
    variacion = 0;

    constructor(nombre, precio_compra, precio_venta, variacion) {
        this.nombre = nombre;
        this.precio_compra = precio_compra;
        this.precio_venta = precio_venta;
        this.variacion = variacion;
    }

    get nombre() {
        return this.nombre;
    }

    get precio_compra() {
        return this.precio_compra;
    }

    get precio_venta() {
        return this.precio_venta;
    }

    get variacion() {
        return this.variacion;
    }

    set precio_compra(precio) {
        this.precio_compra = precio;
    }

    set precio_venta(precio) {
        this.precio_venta = precio;
    }

    set variacion(variacion) {
        this.variacion = variacion;
    }
}

class Cotizaciones {
    cotizaciones = [];

    obtenerCotizacion(nombre) {
        return this.cotizaciones.find(c => c.nombre === nombre);
    }

    agregarCotizacion(cotizacion) {
        this.cotizaciones.push(cotizacion);
    }

    obtenerCotizaciones() {
        return this.cotizaciones;
    }
}

const cotizaciones = new Cotizaciones();

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

async function procesadarDatos(cotizaciones) {
    try {
        const datos = await obtenerPrecios();
        for(x of datos) {

            const nombre = x.casa.nombre;
            const precio_compra = formatearPrecio(x.casa.compra);
            const precio_venta = formatearPrecio(x.casa.venta);
            const variacion = formatearPrecio(x.casa.variacion);
            cotizacion = new Cotizacion(nombre, precio_compra, precio_venta, variacion);
            cotizaciones.agregarCotizacion(cotizacion);
        }
    } catch (error) {
        console.log(error);
    }
}

function formatearPrecio(precio) {
    precio = precio.replace(".", "");
    precio = precio.replace(",", ".");
    precio = Number(precio).toFixed(2);

    let precioFormateado;
    
    if(isNaN(precio)) {
        precioFormateado = "No cotiza";
    } else {
        precioFormateado = precio;
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
                resultado.textContent = `${cantidad} Pesos son ${operacion} Dolares`;
            } else {
                operacion = cantidad * precio;
                resultado.textContent = `${cantidad} Dolares son ${operacion} Pesos`;                
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

function comprobarNombres(cotizacion) {
    if(cotizacion.nombre !== "Dolar Soja" && cotizacion.nombre !== "Bitcoin" && cotizacion.nombre !== "Argentina") {
        return true;
    } else {
        return false;
    }
}

function mostrarDatos(cotizaciones) {
    const datos = cotizaciones.obtenerCotizaciones().filter(comprobarNombres);

    console.log(datos);
    datos.forEach( (element, index) => {
        let bloque = document.createElement('DIV');
        let titulo = document.createElement('H2');
        let contenido = document.createElement('DIV');
        let compra = document.createElement('P');
        let venta = document.createElement('P');

        let nombre = element.nombre;

        if(nombre === "Dolar Contado con Liqui") {
            nombre = "Dolar CCL";
        }

        titulo.classList.add('bloque__titulo');
        titulo.textContent = nombre;

        /*
        precioFormateado = Number(precio).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS'          
        })   */

        let precioCompra = `$ ${element.precio_compra}`;
        let precioVenta = `$ ${element.precio_venta}`;

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
}

document.addEventListener('DOMContentLoaded', async () => {
    darkMode();
    try {
        await procesadarDatos(cotizaciones);  
        mostrarDatos(cotizaciones);
        calculadora();   
    } catch (error) {
        console.log(error);
    }
});

