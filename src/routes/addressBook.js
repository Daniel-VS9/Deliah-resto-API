const express = require('express')
const db = require('../database/db')
const { verifyAdmin } = require('../middleware/auth.mw')
const router = express.Router()

router.get('/', verifyAdmin, async (req, res) => {
    const result = await db.query('SELECT id, body AS address, userID FROM address')

    if(result) return res.json(result)
    res.sendStatus(500)
})

router.get('/myaddresses', async (req, res) => {
    const userId = req.userData.id
    const result = await db.query('SELECT id, body AS address FROM address WHERE userID = ?', [userId])

    if(result) return res.json(result)
    res.sendStatus(500)
})

router.post('/add', async (req, res) => {
    const {address} = req.body
    const userId = req.userData.id
    if (!address) return res.sendStatus(400)

    try {
        await db.query('INSERT INTO address (body, userID) VALUES (?, ?)', [address, userId])
        res.sendStatus(201)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router