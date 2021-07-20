const express = require('express')
const router = express.Router()

const { verifyAdmin} = require('../middleware/auth.mw')
const { getOrders, updateStatus, addOrder, updateOrder, confirmOrder } = require('../models/order')
const { getProducts } = require('../models/product')
const { getUsers } = require('../models/user')

/**
 * @swagger
 * /orders:
 *  get:
 *      summary: Get all users orders 
 *      tags: [Orders]
 *      responses:
 *          '200':
 *              description: A JSON array of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/order'
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 */
router.get('/orders', verifyAdmin, (req, res) => {
    res.json(getOrders())
})

/**
 * @swagger
 * /user/myorders:
 *  get:
 *      summary: Get user orders 
 *      tags: [Orders]
 *      responses:
 *          '200':
 *              description: A JSON array of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/order'
 *          '401':
 *              description: No user is logged in
 */
router.get('/user/myorders', (req, res) => {
    const email = req.auth.user
    res.json(getOrders().filter(o => o.userEmail === email))
})

/**
 * @swagger
 * /order/{id}/status:
 *  put:
 *      summary: Update order status
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: Id of the order
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                      example:
 *                          status: delivered
 *      tags: [Orders]
 *      responses:
 *          '200':
 *              description: Returns the requested product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/product'
 *          '400':
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 *          '404':
 *              description: Order not found
 */
router.put('/order/:id/status', verifyAdmin, (req, res) => {
    const id = req.params.id
    const status = req.body.status
    order = getOrders().filter(o => o.id == id)[0]

    if(order){
        if (status == 'new' || status == 'confirmed' || status == 'ontheway' || status == 'delivered' || status == 'inProcess') {
            res.json(updateStatus(id, status))
        }  else {res.status(400).json({err : 'the status order only can be: new, confirmed, ontheway, delivered, inProcess'})}
    } else {res.sendStatus(404)}
})


/**
 * @swagger
 * /order/modify:
 *  put:
 *      summary: Update the open order
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          products:
 *                              type: array
 *                              items:
 *                                  type: object
 *                          address:
 *                              type: string
 *                          paymentMethod:
 *                              type: string
 *                      example:
 *                          products: [{id: 1, delete: true}, {id: 2, qty: 1}]
 *                          address: 436 E St NW
 *                          paymentMethod: cash
 *      tags: [Orders]
 *      responses:
 *          '201':
 *             description: Order updated
 *             content:
 *                  aplication/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                          example:
 *                              msg : order successfully updated
 *                              order : {id : 1, products : [], status : 'new', userEmail : 'user@mail.com', address : '436 E St NW', paymentMethod : 'cash'}
 *          '400':
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 *          '401':
 *              description: No user is logged in
 */
router.put('/order/modify', (req, res) => {
    const email = req.auth.user
    const {products} = req.body
    let {address, paymentMethod} = req.body
    let updateProducts = []
    let finalPrice = 0
    let pre = false

    const lastOrder = getOrders().filter(o => o.userEmail === email).slice(-1)[0]
    if(lastOrder) {
        lastOrder.status == 'new' ? pre = true : pre = false 
    }
    
    if (pre) {
        if(products && products.length>0) {
            
            products.forEach(product => {
                if (product.delete == true) {
                    let index = lastOrder.products.findIndex(p=> p.id === product.id)
                    lastOrder.products.splice(index , 1)
                    index = products.findIndex(p => p.id === product.id)
                    products.splice(index, 1)
                }
            })
            
            const {matches} = findIdMatches(products, getProducts())
            updateProducts = lastOrder.products.concat(matches)
        }
        if (!address) address = lastOrder.address
        if (!paymentMethod) paymentMethod = lastOrder.paymentMethod
        updateProducts.forEach(p => finalPrice += (p.price * p.qty))

        res.status(201).json([{msg:'order successfully updated'}, {order: updateOrder(lastOrder.id, updateProducts, address, paymentMethod, finalPrice)}])

    } else res.status(400).json({err : 'You dont have an open order'})

})


/**
 * @swagger
 * /order/confirm:
 *  post:
 *      summary: Confirm the open order
 *      tags: [Orders]
 *      responses:
 *          '200':
 *              description: A JSON array of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/order'
 *          '401':
 *              description: No user is logged in
 *          '404':
 *              description: Open order not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
router.post('/order/confirm', (req, res) => {
    const email = req.auth.user
    // const lastOrder = getOrders().filter(o => o.userEmail === email).slice(-1)[0]

    let pre = false

    const lastOrder = getOrders().filter(o => o.userEmail === email).slice(-1)[0]
    if(lastOrder) {
        lastOrder.status == 'new' ? pre = true : pre = false 
    }

    pre ? res.json(confirmOrder(lastOrder.id)) : res.status(404).json({err : 'You dont have an open order'})
    // lastOrder.status === 'new' ? res.json(confirmOrder(lastOrder.id)) : res.status(404).json({err : 'You dont have an open order'})
})

/**
 * @swagger
 * /order/new:
 *  post:
 *      summary: Create a new order
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          products:
 *                              type: array
 *                              items:
 *                                  type: object
 *                          address:
 *                              type: string
 *                          paymentMethod:
 *                              type: string
 *                      example:
 *                          products: [{id: 1, qty: 2}, {id: 3, qty: 1}]
 *                          address: 436 E St NW
 *                          paymentMethod: cash
 *      tags: [Orders]
 *      responses:
 *          '200':
 *              description: A JSON array of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/order'
 *          '401':
 *              description: No user is logged in
 *          '404':
 *              description: Open order not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
router.post('/order/new', (req, res) => {
    const {products, paymentMethod} = req.body
    let {address} = req.body
    const email = req.auth.user
    let finalPrice = 0
    let pre
    const userOrders = getOrders().filter(o => o.userEmail === email)
    
    if(userOrders.length >= 0) {
        if(userOrders.length == 0) {
            pre = true
        } else {
            userOrders.slice(-1)[0].status == 'new' ? pre = false : pre = true
        }
    }

    if(products.length>0 && pre && paymentMethod) { 
        const {matches, err} = findIdMatches(products, getProducts())
        matches.forEach(p => finalPrice += (p.price * p.qty))
        if (!address) address = getUsers().find(u => u.email === email).address
        if(matches.length > 0 && matches.length === products.length && !err[0]) {
            res.json([{msg:'order successfully created'}, {order: addOrder(matches, email, address, paymentMethod, finalPrice)}])
        } else err[0] ? res.status(400).json({err : err}) : res.status(404).json({msg: 'one or more products not found'})        

    } else !pre ? res.status(400).json({err : 'You have an open order, please close it before create a new order'}) : res.sendStatus(400)

})

function findIdMatches(list1, list2) {
    let matches = []
    let err = []
    list1.forEach(i => {
        list2.forEach(j => {
            if(i.id == j.id) {
                if (i.id == j.id && i.qty && i.qty > 0 && typeof(parseInt(i.qty)) == 'number') {
                    j.qty = parseInt(i.qty)
                    matches.push(j)
                } else err.push(`minimum order for ${j.name} is 1`)
            }
        })
    })
    return {matches, err}
}

/**
 * @swagger
 * tags:
 *  name: Orders
 * components:
 *  schemas:
 *      order:
 *          type: object
 *          required:
 *              -id
 *              -products
 *              -status
 *              -userEmail
 *              -address
 *              -paymentMethod
 *          properties:
 *              id:
 *                  type: integer
 *              products:
 *                  type: array
 *              status:
 *                  type: string
 *              userEmail:
 *                  type: string
 *              address:
 *                  type: string
 *              paymentMethod:
 *                  type: string
 *              finalPrice:
 *                  type: number
 *          example:
 *              id: 1
 *              products: [{"id": 1, "name": "Salmon roast", "price": 25.5, 'qty':1}, {"id": 9, "name": "Crab", "price": 29.99, 'qty':1}]
 *              status: new
 *              userEmail: user@mail.com
 *              address: 436 E St NW
 *              paymentMethod: cash
 *              finalPrice: 55.49
 */

module.exports = router