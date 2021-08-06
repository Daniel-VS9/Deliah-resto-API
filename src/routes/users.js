const express = require('express')
const router = express.Router()
const {verifyEmail} = require('../middleware/verify')
const {createToken, authenticate} = require('../middleware/auth.mw')
const User = require('../controllers/user.controller')

router.get('/users', User.getAll)

router.post('/register', verifyEmail, User.create)

router.post('/login', authenticate, createToken, (req, res) => {
    res.json({accessToken : req.token})
})


module.exports = router