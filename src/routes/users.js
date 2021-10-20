const express = require('express')
const router = express.Router()
const {verifyEmail} = require('../middleware/verify')
const {createToken, authenticate, verifyAdmin} = require('../middleware/auth.mw')
const User = require('../controllers/user.controller')

router.get('/', verifyAdmin, User.getAll)

router.post('/register', verifyEmail, User.create)

router.post('/login', authenticate, createToken, (req, res) => {
    res.json({accessToken : req.token})
})

router.put('/suspend/:id', verifyAdmin, User.suspendById)


module.exports = router