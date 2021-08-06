const express = require('express')
const db = require('../database/db')
const {verifyEmail} = require('../middleware/verify')
const {createToken, authenticate} = require('../middleware/auth.mw')
const router = express.Router()


router.get('/users', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM user')
        res.json(users)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.post('/register', verifyEmail, async (req, res) => {
    const {email, fullname, pass, phone, address} = req.body
    const user = [email, fullname, pass, phone, address]

    try {
        await db.query('INSERT INTO user (email, fullname, pass, phone, address) VALUES (?)', [user])
        res.sendStatus(201)
    } catch (err) {
        if(err.code == 'ER_BAD_NULL_ERROR' || err.code == 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
            res.sendStatus(400)
        } else {
            res.sendStatus(500)    
        }
        // console.error(err)
    }

})

router.post('/login', authenticate, createToken, (req, res) => {
    res.json({accessToken : req.token})
})


module.exports = router