const express = require('express')
const db = require('../database/db')
const router = express()

const { verifyAdmin } = require('../middleware/auth.mw')


router.get('/get', verifyAdmin, async (req, res) => {
    try {
        const methods = await db.query('SELECT * FROM payment_method')
        res.json(methods)
    } catch (err) {
        res.sendStatus(500)        
    }
})


router.post('/add', verifyAdmin, async (req, res) => {
    const {name} = req.body
    if(!name || typeof(name) !== 'string' || name === "") return res.sendStatus(400)

    try {
        await db.query('INSERT INTO payment_method (name) VALUES (?)', [name])
        res.sendStatus(201)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.put('/edit/:id', verifyAdmin, async (req, res) => {
    const {id} = req.params
    const {name} = req.body
    if(!name || typeof(name) !== 'string' || name === "") return res.sendStatus(400)

    try {
        const result = await db.query('UPDATE payment_method SET name = ? WHERE id = ?', [name, id])
        if(result.affectedRows == 0) throw new Error('NRA')
        res.sendStatus(204)
    } catch (err) {
        if(err.message == 'NRA') {
            res.sendStatus(404)
        } else res.sendStatus(500)
    }
})

router.delete('/delete/:id', verifyAdmin, async (req, res) => {
    const {id} = req.params

    try {
        const result = await db.query('DELETE FROM payment_method WHERE id = ?', [id])
        if(result.affectedRows == 0) throw new Error('NRA')
        res.sendStatus(204)
    } catch (err) {
        if(err.message == 'NRA') {
            res.sendStatus(404)
        } else res.sendStatus(500)
    }
})


module.exports = router