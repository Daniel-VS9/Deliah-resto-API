const express = require('express')
const db = require('../database/db')
const router = express.Router()

const { verifyAdmin} = require('../middleware/auth.mw')
const {verifyOpenOrder, verifyClosedOrder } = require('../middleware/verify')


router.get('/orders', verifyAdmin, async (req, res) => {
    try {
        const query =
            'SELECT o.id as orderID, s.name as status, u.fullname as username, o.address, pm.name as payment_method, o.final_price FROM order_ o' +
            ' JOIN status s ON o.status_id = s.id' +
            ' JOIN payment_method pm ON pm.id = o.payment_id' +
            ' JOIN user u ON u.id = o.user_id ORDER BY o.id';
        const orders = await db.query(query);

        const ordersWithProducts = []

        await Promise.all( orders.map(async order => {
            const products = await db.query('SELECT name, quantity, price FROM order_product WHERE order_id = ?', [order['orderID']])
            ordersWithProducts.push({order, products})
        }) )

        res.json(ordersWithProducts);
    } catch (err) {
        res.sendStatus(500);
    }
});

router.get('/myorders', async (req, res) => {
    const {id} = req.userData
    
    try {
        const query =
            'SELECT o.id as orderID, s.name as status, u.fullname as username, o.address, pm.name as payment_method, o.final_price FROM order_ o' +
            ' JOIN status s ON o.status_id = s.id' +
            ' JOIN payment_method pm ON pm.id = o.payment_id' +
            ' JOIN user u ON u.id = o.user_id' +
            ' WHERE o.user_id = ? ORDER BY o.id';
        const orders = await db.query(query, [id])
        
        const ordersWithProducts = []

        await Promise.all( orders.map(async order => {
            const products = await db.query('SELECT name, quantity, price FROM order_product WHERE order_id = ?', [order['orderID']])
            ordersWithProducts.push({order, products})
        }) )

        res.json(ordersWithProducts);
    } catch (err) {
        // console.log(err)
        res.sendStatus(500)
    }
})

router.put('/order/:id/status', verifyAdmin, async (req, res) => {
    const {id} = req.params
    const {newStatus} = req.body
    if (!newStatus) return res.sendStatus(400)

    try {
        if (newStatus != 3 && newStatus != 4 && newStatus != 5 && newStatus != 6 && newStatus != 7) throw new Error('InvalidStatus')
        const result = await db.query('UPDATE order_ SET status_id = ? WHERE id = ?', [newStatus, id])
        if (result.affectedRows == 0) throw new Error('orderNotFound')
        res.sendStatus(204)
    } catch (err) {
        // console.error(err)
        if (err.message == 'InvalidStatus') return res.sendStatus(400)
        if (err.message == 'orderNotFound') return res.sendStatus(404)
        res.sendStatus(500)
    }
})

router.post('/order/confirm', verifyOpenOrder, async (req, res) => {
    
    try {
        await db.query('UPDATE order_ SET status_id = 4 WHERE ?', [req.userData.lastOrderId])
        res.sendStatus(204)
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/order/new', verifyClosedOrder, async (req, res) => {
    const {products, paymentMethod} = req.body
    const userId = req.userData.id
    let {address} = req.body

    if (!products || !paymentMethod || !address) return res.sendStatus(400)

    try {
        let finalPrice = 0

        if(typeof address == 'number') {
            address = await db.query('SELECT body FROM address WHERE id = ? AND userID = ?', [address, userId])
            if (!address[0]) throw new Error('ADDRESS_NOT_FOUND')
            address = address[0]['body']
        }

        await db.query('START TRANSACTION')

        // let userAddress = await db.query('SELECT address FROM user WHERE id = ?', [userId])
        // userAddress = userAddress[0]['address']
        

        
        // const address = req.body.address || userAddress 
        
        const orderInserted = await db.query(
            'INSERT INTO order_ (user_id, payment_id, final_price, address) VALUES (?, ?, ?, ?)',
            [userId, paymentMethod, finalPrice, address]
        );
        
        await Promise.all(
            products.map(async product => {
                const result = await db.query('SELECT name, price FROM product WHERE id = ?', [product.id])

                if (result.length == 0) throw new Error('ProductNotFound')
                if (product.quantity < 1 || !Number.isInteger(product.quantity)) throw new Error('QuantityInvalid')
                
                await db.query(
                    'INSERT INTO order_product (order_id, quantity, name, price) VALUES (?, ?, ?, ?)',
                    [
                        orderInserted.insertId,
                        product.quantity,
                        result[0]['name'],
                        result[0]['price']
                    ]
                );
                finalPrice += parseFloat(result[0]['price']).toFixed(2) * product.quantity 
            })
        )
        finalPrice = finalPrice.toFixed(2)
        
        await db.query('UPDATE order_ SET final_price = ? WHERE id = ?', [finalPrice, orderInserted.insertId])

        await db.query('COMMIT')

        res.sendStatus(201)

    } catch (err) {
        await db.query('ROLLBACK')

        if (err.message == 'ProductNotFound') return res.status(404).json({err : err.message})
        if (err.message == 'QuantityInvalid') return res.status(400).json({err : err.message})
        if (err.message == 'ADDRESS_NOT_FOUND') return res.status(404).json({err : err.message})
        if (err.code == 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({err : 'payment method not found'}) // TODO: test that
        console.log(err)
        res.sendStatus(500)
    }
})

router.put('/order/modify', verifyOpenOrder, async (req, res) => {
    const {products} = req.body
    let {address, paymentMethod} = req.body
    const userId = req.userData.id

    try {
        
        await db.query('START TRANSACTION')
        
        const order = await db.query('SELECT * FROM order_ WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId])  
        const orderId = order[0]['id']   
        
        
        if (address){
            if(typeof address == 'number') {
                address = await db.query('SELECT body FROM address WHERE id = ? AND userID = ?', [address, userId])
                if (!address[0]) throw new Error('ADDRESS_NOT_FOUND')
                address = address[0]['body']
            }
            await db.query('UPDATE order_ SET address = ? WHERE id = ?', [address,  orderId])
        }

        if (paymentMethod) {
            await db.query('UPDATE order_ SET payment_id = ? WHERE id = ?', [paymentMethod, orderId])
        } 

        const productsFromOrder = await db.query('SELECT name, quantity, price FROM order_product WHERE order_id = ?', [orderId])
        if (products) {
            // console.log(products)
            
            await Promise.all( products.map(async product => {
                let change = false
                // if(!product['quantity']) product['quantity'] = 1

                productsFromOrder.map(async productFromOrder => {
                    if(productFromOrder['name'] == product['name']) {
                        change = true

                        // TODO: Working...
                        if (product['quantity'] == 0) {
                            await db.query('DELETE FROM order_product WHERE order_id = ? and name = ?', [orderId, product['name']])
                        }
                        // console.log(product['quantity'], orderId, product['name'])
                        await db.query('UPDATE order_product SET quantity = ? WHERE order_id = ? and name = ?', [product['quantity'], orderId, product['name']])
                    }
                })

                if(!change) {
                    change = false
                    const checkProduct = await db.query('SELECT id, price FROM product WHERE name = ?', [product['name']])
                    if(checkProduct.length < 1) throw new Error('ProductNotFound')
                    await db.query(
                        'INSERT INTO order_product (order_id, quantity, name, price) VALUES (?, ?, ?, ?)',
                        [
                            orderId,
                            product['quantity'],
                            product['name'],
                            checkProduct[0]['price'],
                        ]
                    );
                }
            }))
    
            // TODO: PROCEDIMIENTOS DE ALMACENADO EN MYSQL
    
            let finalPrice = 0
            const finalProducts = await db.query('SELECT * FROM order_product WHERE order_id = ?', [orderId])
    
            finalProducts.map(product => {
                finalPrice += product['price'] * product['quantity'];
            })
    
            await db.query('UPDATE order_ SET final_price = ? WHERE id = ?', [finalPrice.toFixed(2), orderId])
        }

        await db.query('COMMIT')
        res.sendStatus(204)

    } catch (err) {
        await db.query('ROLLBACK')

        if(err.message == 'ProductNotFound') return res.status(404).json({err: 'product not found'})
        if (err.message == 'ADDRESS_NOT_FOUND') return res.status(404).json({err : err.message})
        if (err.code == 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({err : 'payment method not found'})
        console.log(err)
        res.sendStatus(500)
    }
})


module.exports = router