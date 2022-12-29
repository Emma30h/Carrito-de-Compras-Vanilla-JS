const container = document.getElementById("container");
const template = document.getElementById("template-cards").content;
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

window.addEventListener("DOMContentLoaded", ()=>{
    fetchAPI();
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
    }
    pintarCarrito();
});

container.addEventListener("click", (e)=>{
    añadirCarrito(e);
});

items.addEventListener("click", (e)=>{
    btnAccion(e);
});

const fetchAPI = async()=>{
    try {
        const response = await fetch(`api.json`);
        const data = await response.json();
        pintarProductos(data);  
    } catch (error) {
        console.log(error);
    }    
};

const pintarProductos = (productos)=>{
    productos.forEach(element =>{
        // console.log(element);
        template.querySelector("img").setAttribute("src", element.url);
        template.querySelector("h2").textContent = element.nombre;
        template.querySelector("span").textContent = element.precio;
        template.querySelector("button").dataset.id = element.id;

        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    container.appendChild(fragment);
};

const añadirCarrito = (e)=>{
    if(e.target.classList.contains("btn-comprar")){
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const setCarrito = (objeto)=>{
    let producto = {
        id: objeto.querySelector(".btn-comprar").dataset.id,
        nombre: objeto.querySelector("h2").textContent,
        precio: objeto.querySelector("span").textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto};

    pintarCarrito();
};

const pintarCarrito = ()=>{
    items.innerHTML = "";
    Object.values(carrito).forEach(producto=>{
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelectorAll("button")[0].dataset.id = producto.id;
        templateCarrito.querySelectorAll("button")[1].dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    pintarFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () =>{
    footer.innerHTML = ``;
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `;
        return;
    }
    
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;
    
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciarTodo = document.getElementById("vaciar-carrito");
    btnVaciarTodo.addEventListener("click", ()=>{
        carrito = {};
        pintarCarrito();
    });
};

const btnAccion = (e)=>{
    if(e.target.classList.contains("btn-info")){   
       carrito[e.target.dataset.id].cantidad++;
        pintarCarrito();
    };
    if(e.target.classList.contains("btn-danger")){
        carrito[e.target.dataset.id].cantidad--;
        if(carrito[e.target.dataset.id].cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }
    e.stopPropagation();
};

