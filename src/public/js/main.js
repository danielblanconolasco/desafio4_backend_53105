console.log("Conectado")

const socket = io()

//Receive the products from the server
socket.on("products", (data) => {
    renderProducts(data)
})

// Function to render real time products using socket.io
const renderProducts = (products) => {
    const productsContainer = document.getElementById('products-container')
    productsContainer.innerHTML = ''
    
    products.forEach(product => {
            const productDiv = document.createElement('div')
            productDiv.className = 'col'
            productDiv.innerHTML = `
            <div class=card>
            <div class=card-body>
                <!-- <img src="" class="card-img-top" alt="...">-->
                <h5 class=card-title>${product.title}</h5>
                <p class=card-tex">${product.description}</p>
                <p>${product.price}</p>
                <button type="button" class="btn btn-danger">Delete from inventory</button>
            </div>
            </div>
            `
            productsContainer.appendChild(productDiv)
    
            // Event listener for deleting a product
            productDiv.querySelector('button').addEventListener('click', () => {
                deleteProduct(product.id)
            })
        })
}

// Function to delete a product
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}

// Event listener for adding a product
document.getElementById('addProduct').addEventListener('click', () => {
    addProduct()
})

const addProduct = () => {
    const product = {
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        thumbnail: document.getElementById('productThumbnails').value,
        code: document.getElementById('productCode').value,
        stock: document.getElementById('productStock').value,
        status:document.getElementById('productStatus').value === 'true',
    }
    socket.emit('addProduct', product)
    console.log(product)
}