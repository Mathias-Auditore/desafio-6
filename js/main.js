//COMPRA Y CARRITO
//Declarar VARIABLES Y CONSTANTES

const cartas = document.getElementById('cards')
const items = document.getElementById("items")
const finCompra = document.getElementById("fin-compra")
const cartaTemplate = document.getElementById("carta-template").content
const downTemplate = document.getElementById("down-template").content
const compraTemplate = document.getElementById("compra-template").content
const fragment = document.createDocumentFragment()
let carrito = []



// JSON 

document.addEventListener("DOMContentLoaded", () => {
    fetchData()

    //LocalStorage
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        impresionCarrito()
    }

})

const fetchData = async () => {
    try {
        const res = await fetch('js/api.json')
        const data = await res.json()
        impresion(data)
    } catch (error) {
        console.log(error)
    }
}

//EVENTOS

cartas.addEventListener("click", evento => {
    agregarCarrito(evento)
})

items.addEventListener("click", evento => {
    btnAccionar(evento)
})


//Imprimo las existencias de las tiendas con ayuda del JSON

const impresion = data => {
    data.forEach(instrumentos => {
        cartaTemplate.querySelector(".titulo-producto").textContent = instrumentos.title
        cartaTemplate.querySelector(".precio").textContent = instrumentos.precio
        cartaTemplate.querySelector(".instrument-img").setAttribute("src", "../img/index/" + instrumentos.thumbnailUrl)
        cartaTemplate.querySelector(".botonera").dataset.id = instrumentos.id

        const clone = cartaTemplate.cloneNode(true)
        fragment.appendChild(clone)
    })
    cartas.appendChild(fragment)
}

const agregarCarrito = evento => {
    if (evento.target.classList.contains("botonera")) {
        setCarrito(evento.target.parentElement)
    }
    evento.stopPropagation()
}

const setCarrito = objeto => {
    const instrumento = {
        id: objeto.querySelector(".botonera").dataset.id,
        title: objeto.querySelector(".titulo-producto").textContent,
        precio: objeto.querySelector(".precio").textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(instrumento.id)) {
        instrumento.cantidad = carrito[instrumento.id].cantidad + 1
    }

    carrito[instrumento.id] = { ...instrumento }
    impresionCarrito()
}

const impresionCarrito = () => {
    items.innerHTML = ""

    Object.values(carrito).forEach(instrumento => {
        compraTemplate.querySelector("th").textContent = instrumento.id
        compraTemplate.querySelectorAll("td")[0].textContent = instrumento.title
        compraTemplate.querySelectorAll("td")[1].textContent = instrumento.cantidad
        compraTemplate.querySelector("span").textContent = instrumento.cantidad * instrumento.precio

        //Los botones
        compraTemplate.querySelector(".btn-info").dataset.id = instrumento.id
        compraTemplate.querySelector(".btn-danger").dataset.id = instrumento.id


        const clone = compraTemplate.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    imprimirfinCompra()

    //local Storage
    localStorage.setItem("carrito", JSON.stringify(carrito))
}



const imprimirfinCompra = () => {
    finCompra.innerHTML = ""

    //Por si el carrito está vacio

    if (Object.keys(carrito).length === 0) {
        finCompra.innerHTML = `
        <th scope="row" colspan="5">El carrito está vacio</th>
        `
        return
    }


    //Tomar la Cantidad y precio total de productos elegidos

    const cantidadAll = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const PrecioAll = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    downTemplate.querySelectorAll("td")[0].textContent = cantidadAll
    downTemplate.querySelector("span").textContent = PrecioAll

    const clone = downTemplate.cloneNode(true)
    fragment.appendChild(clone)
    finCompra.appendChild(fragment)

    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
        carrito = {}
        impresionCarrito()
    })
}

//Botones de aumentar y disminuir

const btnAccionar = evento => {
    // El +
    if (evento.target.classList.contains("btn-info")) {
        const instrumento = carrito[evento.target.dataset.id]
        instrumento.cantidad = carrito[evento.target.dataset.id].cantidad + 1
        carrito[evento.target.dataset.id] = { ...instrumento }
        impresionCarrito()
    }

    // El -
    if (evento.target.classList.contains("btn-danger")) {
        const instrumento = carrito[evento.target.dataset.id]
        instrumento.cantidad = carrito[evento.target.dataset.id].cantidad - 1

        if (instrumento.cantidad === 0) {
            delete carrito[evento.target.dataset.id]
        }
        impresionCarrito()
    }

    evento.stopPropagation
}



//LIBRERIA GLIDER
window.addEventListener("load", function () {
    new Glider(document.querySelector(".carrusel__lista"), {
    // Mobile-first defaults
  slidesToShow: 1,
  slidesToScroll: 1,
  scrollLock: true,
  dots: '.indicador',
  arrows: {
    prev: '.carrusel__previous',
    next: '.carrusel__next'
  },
  responsive: [
    {
      // screens greater than >= 775px
      breakpoint: 775,
      settings: {
        // Set to `auto` and provide item width to adjust to viewport
        slidesToShow: 'auto',
        slidesToScroll: 'auto',
        itemWidth: 150,
        duration: 0.25
      }
    },{
      // screens greater than >= 1024px
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        itemWidth: 150,
        duration: 0.25
      }
    }
  ]
})
});
