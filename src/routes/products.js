const express = require('express')
const db = require('../database/db')
const router = express.Router()

const {verifyAdmin} = require('../middleware/auth.mw')

router.get('/', async (req, res) => {
    try {
        const products = await db.query('SELECT * FROM product')
        res.json(products)
    } catch (err) {
        res.sendStatus(500)        
    }
})

router.post('/new', verifyAdmin, async (req, res) => {
    const {name, price} = req.body

    try {
        await db.query('INSERT INTO product (name, price) VALUES (?, ?)', [name, price])
        res.sendStatus(201)
    } catch (err) {
        if(err.code == 'ER_BAD_NULL_ERROR') {
            res.sendStatus(400)
        } else {
            res.json(err)
        }
    }
})

router.put('/edit/:id', verifyAdmin, async (req, res) => {
    const {id} = req.params
    let {name, price} = req.body

    try {
        const product = await db.query('SELECT * FROM product WHERE id = ?', [id])
        if (product.length == 0) throw new Error('IDNF')
        if (!name) name = product[0]['name']
        if (price == undefined) price = product[0]['price']
        await db.query('UPDATE product SET name = ?, price = ? WHERE id = ?', [name, price, id])
        res.sendStatus(204)
    } catch (err) {
        if(err.message == 'IDNF') {
            res.sendStatus(404)
        } else res.sendStatus(500)
    }
})

router.delete('/delete/:id', verifyAdmin, async (req, res) => {
    const {id} = req.params

    try {
        const result = await db.query('DELETE FROM product WHERE id = ?', [id])
        if(result.affectedRows == 0) throw new Error('NoRowsAffected')
        res.sendStatus(204)
    } catch (err) {
        // console.log(err)
        if(err.message == 'NoRowsAffected') return res.sendStatus(404)
        res.sendStatus(500)
    }
})

module.exports = router