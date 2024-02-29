import express from 'express'
const router = express.Router()
import CartManager from '../controllers/cartManager.js'

// Calling an instance for router to work
const cartManager = new CartManager()

// Route to get carts with optional limit query parameter
router.get(`/`, async (req,res) => {
    try {
        const limit = parseInt(req.query.limit)
        let carts
        if (limit) {
            carts = await cartManager.getCarts()
            const slicedCarts = carts.slice(0, limit)
            res.json(slicedCarts)            
        } else {
            carts = await cartManager.getCarts()
            res.json(carts)            
        }
    } catch (error) {
        console.log(`Error getting carts on getCarts`, error)
    }
})

// Route to get a specific cart by its ID (cid)
router.get(`/:cid`, async (req,res) => {
    const cid = parseInt(req.params.cid)
    try {
        const cart = await cartManager.getCartByCid(cid)
        if (cart) {
            res.send(cart)           
        } else {
            res.status(404).send(`Cart ID ${cid} not found`)
        }
    } catch (error) {
        res.status(500).send(`Error getting the cart by ID ${cid}`)
        console.log(error)
    }
})


// Route to add a product to a specific cart
router.post(`/:cid/product/:pid`, async (req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const quantity = parseInt(req.body.quantity)
    try {
        const updatedCart = await cartManager.addCart(cid, pid, quantity)
        const specificCart = updatedCart.find(cart => cart.cid === cid)
        res.status(201).send(specificCart)
    } catch (error) {
        res.status(500).send(`Error adding the cart`)
        console.log(error)
    }
})

// Route to delete a cart by its ID (cid)
router.delete(`/:cid`, async (req, res) => {
    const cid = parseInt(req.params.cid)
    try {
        const updatedCarts = await cartManager.deleteCart(cid)
        res.send(`Cart ID ${cid} deleted`)
    } catch (error) {
        res.status(500).send(`Error deleting the cart ID ${cid}`)
        console.log(error)
    }
})


export default router
