const express = require('express')
const router = express.Router()

const {verifyAdmin} = require('../middleware/auth.mw')
const {getProducts, addProduct, updateProduct, deleteProduct} = require('../models/product')

/**
 * @swagger
 * /products:
 *  get:
 *      summary: Get all products
 *      tags: [Products]
 *      responses:
 *          '200':
 *              description: A JSON array of products
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/product'
 *          '401':
 *              description: No user is logged in
 */
router.get('/', (req, res) => {
    res.json(getProducts())
})

// /**
//  * @swagger
//  * /products/{id}:
//  *  get:
//  *      summary: Get product by id
//  *      parameters:
//  *        - name: id
//  *          in: path
//  *          required: true
//  *          description: Id of the product
//  *          schema:
//  *              type: integer
//  *      tags: [Products]
//  *      responses:
//  *          '200':
//  *              description: Returns the requested product
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          $ref: '#/components/schemas/product'
//  *          '401':
//  *              description: No user is logged in
//  *          '404':
//  *              description: Product not found
//  */
// router.get('/:id', (req, res) => {
//     const id = req.params.id
//     const product = getProducts().filter(p => p.id == id)[0]
//     product ? res.json(product) : res.sendStatus(404)
// })

/**
 * @swagger
 * /products/new:
 *  post:
 *      summary: Create a new product
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          price:
 *                              type: number
 *                      example:
 *                          name: Salmon roast
 *                          price: 25.5
 *      tags: [Products]
 *      responses:
 *          '201':
 *              description: Created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 */
router.post('/new', verifyAdmin, (req, res) => {
    const {name, price} = req.body

    if (name && typeof(price) == 'number') {
        if (!getProducts().find(product => product.name == name)) {
            addProduct(name, price)
            res.status(201).json({msg : "product successfully added"})
        } else res.status(400).json({err : 'This product already exist'})
    } else res.sendStatus(400)
    // } else {res.status(400).json([{msg : "The id has to be a number"}])}
})

/**
 * @swagger
 * /products/edit/{id}:
 *  put:
 *      summary: Update product by id
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: Id of the product
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          price: 
 *                              type: number
 *                      example:
 *                          name: Margarita
 *                          price: 12.99
 *      tags: [Products]
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
 *              description: Product not found
 */
router.put('/edit/:id', verifyAdmin, (req, res) => {
    const id = req.params.id
    const product = getProducts().filter(p => p.id == id)[0]

    if (product) {
        const {name, price} = req.body
        if (typeof(price) == 'number') {
            product ? res.json({msg : updateProduct(id, name, price)}) : res.status(400)
        } else {res.status(400).json([{err : "The price has to be a number"}])}
    } else {
        res.sendStatus(404)
    }
})

/**
 * @swagger
 * /products/delete/{id}:
 *  delete:
 *      summary: Delete product by id
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: Id of the product
 *          schema:
 *              type: integer
 *      tags: [Products]
 *      responses:
 *          '200':
 *              description: Returns the requested product
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 *          '404':
 *              description: Product not found
 */
router.delete('/delete/:id', verifyAdmin, (req, res) => {
    const id = req.params.id
    const product = getProducts().findIndex(p => p.id == id)

    if (product >= 0) {
        deleteProduct(product)
        res.json({msg : 'product successfully deleted'})
    } else {
        res.sendStatus(404)
    }
})

/**
 * @swagger
 * tags:
 *  name: Products
 * components:
 *  schemas:
 *      product:
 *          type: object
 *          required:
 *              -id
 *              -name
 *              -price
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              price:
 *                  type: number
 *          example:
 *              id: 1
 *              name: Salmon roast
 *              price: 25.50
 */

module.exports = router