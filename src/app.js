import express from 'express'
import __dirname from './utils.js'
import exphbs from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import ProductManager from './controllers/productManager.js'
const productManager = new ProductManager

const PORT = 8080
const app = express()

const router = express.Router()

// Middlewares
app.use(express.static(`./src/public`))

// Configuracion de handlebars
app.engine(`handlebars`, exphbs.engine())
app.set(`view engine`, `handlebars`)
app.set(`views`, `./src/views`)

// Rutas
app.use(`/`, viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'


// Listen:
const httpServer = app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})

// Config Socket.io
const io = new Server(httpServer)

// Connection successful
io.on("connection", async (socket) => {
    console.log("Client connected")

    // Array for connected client
    socket.emit("products", await productManager.getProducts())

    // Event for when a client erase a product
    socket.on("deleteProduct",  async (id) => {
        await productManager.deleteProductById(id)

        // Send the updated products to all clients
        socket.emit("products", await productManager.getProducts())

    })
    // Add a product 
    socket.on("addProduct", async (product) => {
       console.log(product)
       await productManager.addProduct(product)
       io.sockets.emit("productos", await productManager.getProducts())
   })
})