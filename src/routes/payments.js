const express = require('express')
const router = express()

const { verifyAdmin } = require('../middleware/auth.mw')
const { getPaymentMethods, addPaymenMethod, deletePaymentMethod, updatePaymentMethod } = require('../models/payment')


/**
 * @swagger
 * /payments:
 *  get:
 *      summary: get all methods of payment
 *      tags: [paymentMethods]
 *      responses:
 *          '200':
 *              description: A JSON array of payment methods
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/paymentMethod'
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 */
router.get('/', verifyAdmin, (req, res) => {
    res.json(getPaymentMethods())
})

/**
 * @swagger
 * /payments/add:
 *  post:
 *      summary: Add a new payment method
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                      example:
 *                          name: check
 *      tags: [paymentMethods]
 *      responses:
 *          '201':
 *              description: Created. Return the JSON array of payment methods
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/paymentMethod'
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 */
router.post('/add', verifyAdmin, (req, res) => {
    const {name} = req.body
    if (name && typeof(name) == 'string' && name.length >= 1) {
        if (!getPaymentMethods().find(m => m.name == name)) {
            addPaymenMethod(name)
            res.status(201).json(getPaymentMethods())
        } else res.status(400).json({err : 'This payment method already exists'})
    } else res.sendStatus(400)
})


/**
 * @swagger
 * /payments/{name}/delete:
 *  delete:
 *      summary: Delete a payment method
 *      parameters:
 *        - name: name
 *          in: path
 *          required: true
 *          description: Name of the payment method to delete 
 *          schema:
 *              type: string
 *      tags: [paymentMethods]
 *      responses:
 *          '200':
 *              description: Deleted. Return the JSON array of payment methods
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/paymentMethod'
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 *          '404':
 *              description: Payment method not found
 */
router.delete('/:name/delete', verifyAdmin, (req, res) => {
    const name = req.params.name
    if (name && typeof(name) == 'string') {
        if (getPaymentMethods().find(m => m.name === name)) {
            deletePaymentMethod(name)
            res.json(getPaymentMethods())
        } else res.sendStatus(404)
    } else res.sendStatus(400)
})

/**
 * @swagger
 * /payments/{method}/edit:
 *  put:
 *      summary: Edit a payment method
 *      parameters:
 *        - name: method
 *          in: path
 *          required: true
 *          description: Name of the payment method to edit 
 *          schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                      example:
 *                          name: card
 * 
 *      tags: [paymentMethods]
 *      responses:
 *          '200':
 *              description: Updated. Return the payment method updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/paymentMethod'
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: No user is logged in
 *          '403':
 *              description: This route is only for admins
 *          '404':
 *              description: Payment method not found
 */
router.put('/:method/edit', verifyAdmin, (req, res) => {
    const method = req.params.method
    const {name} = req.body 
    if (name && typeof(name) == 'string') {
        // console.log(typeof(parseInt(name)) == NaN )
        const index = getPaymentMethods().findIndex(m => m.name === method) 
        if (index > -1) {
            updatePaymentMethod(index, name)
            res.json(getPaymentMethods()[index])
        } else res.sendStatus(404)
    } else res.sendStatus(400)
})

/**
 * @swagger
 * tags:
 *  name: paymentMethods
 * components:
 *  schemas:
 *      paymentMethod:
 *          type: object
 *          required:
 *              -name
 *          properties:
 *              name:
 *                  type: string
 *          example:
 *              name: cash
 */

module.exports = router