
//DOM
document.addEventListener('DOMContentLoaded', () => { 
    // Variables
    const baseDeDatos = [
        {
            id:1,
            nombre: 'Medicina Psiquiatrica',
            precio: 250000,
            imagen: 'assets/img/2.jpg',
            categoria: 'consulta Externa'
        },
        {
            id:3,
            nombre: 'Psicologia',
            precio: 80000,
            imagen: 'assets/img/1.jpg',
            categoria: 'consulta Externa'
        },
        {
            id:2,
            nombre: 'Medicina',
            precio: 50000,
            imagen: 'assets/img/3.jpg',
            categoria: 'consulta Externa'
        },
        {
            id:4,
            nombre: 'Fonoaudiologia',
            precio: 70000,
            imagen: 'assets/img/4.jpg',
            categoria: 'consulta Externa'
        },
        {
            id:5,
            nombre: 'Teraía Ocupacional',
            precio: 90000,
            imagen: 'assets/img/5.jpg',
            categoria: 'consulta Externa'
        },
        {
            id:6,
            nombre: 'Fisioterapia',
            precio: 50000,
            imagen: 'assets/img/1.jpg',
            categoria: 'consulta Externa'
        },
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    const filtroSelect = document.getElementById("filtro");

    //funciones 
    
    function renderizarProductos() {
        DOMitems.innerHTML = "";
        const filtro = filtroSelect.value;
        const productosFiltrados = baseDeDatos.filter(producto =>            
            filtro === "todas" || producto.categoria === filtro);
            //estructura
        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card','col-sm-4');
            //body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            //titulo
            const miNodoTitle = document.createElement('h6');
            miNodoTitle.classList.add('card-tilte');
            miNodoTitle.textContent =info.nombre;
            //imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src',info.imagen);
            //precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent =  `${divisa}${info.precio}`;
            // Boton
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anadirProductoAlCarrito);
            //insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
// Obtén el contador del almacenamiento local
    let visitas = localStorage.getItem('contadorVisitas');

// Si no hay visitas almacenadas, inicializa a 0
    if (!visitas) {
    visitas = 0;
    }
// Incrementa el contador
    visitas++;
// Guarda el nuevo contador en el almacenamiento local
    localStorage.setItem('contadorVisitas', visitas);
// Muestra el contador en la página
    document.getElementById('contador').textContent = visitas;
    function anadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizamos el carrito
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length)

    } 
    function handleCarritoValue(value) {
        const carritoContainer = document.getElementById("carrito-value");
        carritoContainer.textContent =  `${value}`
    }

    //dibujar todos los productos guardados en el carrito
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
                  // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
                  // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();     
    }
            /**
          * Evento para borrar un elemento del carrito
          */
    function borrarItemCarrito(evento) {
              // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
              // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
              // volvemos a renderizar
        renderizarCarrito();
              // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length)
    }
            
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            handleCarritoValue(carrito.length);
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    filtroSelect.addEventListener('change', renderizarProductos);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});


