const express = require('express')
const db = require('../database/db')
const router = express()

const { verifyAdmin } = require('../middleware/auth.mw')
const PaymentMethod = require('../controllers/paymentMethod.controller')


router.get('/get', verifyAdmin, PaymentMethod.getAll)

router.post('/add', verifyAdmin, PaymentMethod.create)

router.put('/edit/:id', verifyAdmin, PaymentMethod.editById)

router.delete('/delete/:id', verifyAdmin, PaymentMethod.deleteById)


module.exports = router