const express = require('express')
const db = require('../database/db')
const router = express()

const { verifyAdmin } = require('../middleware/auth.mw')
const PaymentMethod = require('../controllers/paymentMethod.controller')

// TODO: verify admin here
router.get('/get', PaymentMethod.getAll)

router.post('/add', verifyAdmin, PaymentMethod.create)

router.put('/edit/:id', verifyAdmin, PaymentMethod.editById)

router.delete('/delete/:id', verifyAdmin, PaymentMethod.deleteById)


module.exports = router