import express from 'express'
const router =  express.Router()
import ProductManager from '../controllers/productManager.js'

// Calling an instance for router to work
const productManager = new ProductManager

// Router
router.get('/', (req, res) => {
    try {
        res.render('index')
    } catch (error) {
        console.log('Error getting index', error)
    }
})

router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render ('home', { products })
    } catch (error) {
        console.log('Error getting products on getProducts', error)
    }
})

router.get('/realtimeproducts', (req,res) => {
try {
    res.render('realtimeproducts')
} catch (error) {
    console.log('Error getting products on real time products', error)
}
})

export default router