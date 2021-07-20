const express = require('express')
const router = express.Router()

const {addUser, getUsers} = require('../models/user')

/**
 * @swagger
 * /register:
 *  post:
 *      summary: Register a new user
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          name:
 *                              type: string
 *                          pass: 
 *                              type: string
 *                          phone: 
 *                              type: string
 *                          address: 
 *                              type: string
 *                      example:
 *                          email: john@mail.com
 *                          name: John S
 *                          pass: '12345678'
 *                          phone: '3003003030'
 *                          address: '436 E St NW'
 *      tags: [Users]
 *      responses:
 *          '201':
 *              description: User created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
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
 * 
 */
router.post('/register', (req, res) => {
    const {email, name, pass, phone, address} = req.body

    if(email && name && pass && phone && address) {
        if (email.search(/\w+@\w+/) >= 0 && pass.length > 3) {
            if(verifyEmail(email)){
                addUser(email, name, pass, phone, address)
                // console.log(getUsers())
                res.status(201).json({msg : 'user successfully register'})
            } else {res.status(400).json({err : 'this email is already registered'})}
        } else {res.status(400).json({err : 'invalid email or password'})}
    } else res.status(400).json({err : 'Missing data'})

})

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Sign in
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          pass: 
 *                              type: string
 *                      example:
 *                          email: abby@mail.com
 *                          pass: "1234"
 *      tags: [Users]
 *      responses:
 *          '200':
 *              description: Successful login
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
 *              description: Incorrect user or password
 * 
 */
router.post('/login', (req, res) => {
    const {email, pass} = req.body
    if (!email || !pass) res.sendStatus(400)
    else getUsers().find(u => u.email === email && u.pass == pass) ? res.json({msg: 'Successful login'}) : res.sendStatus(401)
})


function verifyEmail(email) {
    match = getUsers().find(u => u.email === email)

    if (!match) {
        return true
    } else {return false}
}

/**
 * @swagger
 * tags:
 *  name: Users
 * components:
 *  schemas:
 *      user:
 *          type: object
 *          required:
 *              -email
 *              -pass
 *              -isAdmin
 *          properties:
 *              email:
 *                  type: string
 *              name:
 *                  type: string
 *              pass:
 *                  type: string
 *              phone:
 *                  type: string
 *              address:
 *                  type: string
 *              isAdmin:
 *                  type: boolean
 *          example:
 *              email: user@mail.com
 *              name: full username
 *              pass: pas$w0rd
 *              phone: 3011111111
 *              address: address
 *              isAdmin: false
 */

module.exports = router