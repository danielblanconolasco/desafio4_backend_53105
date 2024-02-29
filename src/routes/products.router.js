import express from 'express'
const router = express.Router()
import ProductManager from '../controllers/productManager.js'

// Calling an instance for router to work
const productManager = new ProductManager

// Products Router
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        let products

        if (limit) {
            products = await productManager.getProducts()
            const slicedProducts = products.slice(0, limit)
            res.status(200).json(slicedProducts)
        } else {
            products = await productManager.getProducts()
            res.status(200).json(products)
        }
    } catch (error) {
        console.log('Error getting products on getProducts', error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const product = await productManager.getProductById(id)
        if (product) {
            res.status(200).send(product)
        } else {
            res.status(404).send(`Product ID ${id} not found`)
        }
    } catch (error) {
        res.status(500).send(`Error getting the product by ID ${id}`, error)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        let newProduct = req.body
        const updatedProduct = await productManager.updateProductById(id, newProduct)
        if (updatedProduct) {
            res.status(200).send(`Product ID ${id} updated`)
        } else {
            res.status(404).send(`Product ID ${id} not found`)
        }
    } catch (error) {
        console.log(`Error updating the product by Id ${id}`, error)
    }
})

router.post(`/`, async (req, res) => {
    try {
        const newProduct = req.body
        const addedProduct = await productManager.addProduct(newProduct)

        if (addedProduct) {
            res.status(200).send(`Product added successfully ${addedProduct.title} with ID ${addedProduct.id}`)
        } else {
            res.status(400).send({ status: 400, message: `Error adding product code: ${newProduct.code} already exists.` })
        }
    } catch (error) {
        console.log(`Error adding product`, error)
        res.status(500).send({ status: 500, message: `Internal server error` })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const deletedProduct = await productManager.deleteProductById(id)
        if (deletedProduct) {
            res.status(200).send(`Product ID ${id} deleted`)
        } else {
            res.status(404).send(`Product ID ${id} not found`)
        }
    } catch (error) {
        res.status(500).send(`Error deleting the product by ID ${id}`, error)
    }
})

export default router

