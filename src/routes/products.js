const express = require('express')
const router = express.Router()

const {verifyAdmin} = require('../middleware/auth.mw')
const products = require('../controllers/product.controller')

router.get('/', products.getAll)

router.post('/new', verifyAdmin, products.create)

router.put('/edit/:id', verifyAdmin, products.editById)

router.delete('/delete/:id', verifyAdmin, products.deleteById)

module.exports = router