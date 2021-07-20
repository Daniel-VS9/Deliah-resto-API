const orders = [
    {
        id : 1,
        products : [
            {
                "id": 3,
                "name": "plato 3",
                "price": 7.99,
                "qty" : 2
            }
        ],
        status : 'delivered',
        userEmail : 'admin@mail.com',
        address : '725 NE 166th St',
        paymentMethod : 'cash',
        finalPrice : 15.98
    },
    {
        id : 2,
        products : [
            {
                "id": 2,
                "name": "plato 2",
                "price": 10.99,
                'qty' : 3
            }
        ],
        status : 'confirmed',
        userEmail : 'abby@mail.com',
        address : '360 NW 98th St',
        paymentMethod : 'cash',
        finalPrice : 32.97
    },
    {
        id : 3,
        products : [
            {
                "id": 2,
                "name": "plato 2",
                "price": 10.99,
                'qty' : 1
            }
        ],
        status : 'inProcess',
        userEmail : 'admin@mail.com',
        address : '9018 SW 161st Ter',
        paymentMethod : 'cash',
        finalPrice : 10.99
    },
    {
        id : 4,
        products : [
            {
                "id": 3,
                "name": "plato 3",
                "price": 7.99,
                "qty" : 1
            }
        ],
        status : 'ontheway',
        userEmail : 'jack@mail.com',
        address : '436 E St NW',
        paymentMethod : 'cash',
        finalPrice : 7.99
    },
    {
        id : 5,
        products : [
            {
                "id": 3,
                "name": "plato 3",
                "price": 7.99,
                "qty" : 1
            }, 
            {
                "id": 2,
                "name": "plato 2",
                "price": 10.99,
                'qty' : 1
            }
        ],
        status : 'new',
        userEmail : 'abby@mail.com',
        address : '3394 NW 52nd St',
        paymentMethod : 'cash',
        finalPrice : 18.98
    },
]

const getOrders = () => {
    return orders
}

const updateStatus = (id, status) => {
    order = orders.findIndex(o => o.id == id)
    orders[order].status = status
    return orders[order]
    // return "status successfully updapted"
}

const updateOrder = (id, products, address, paymentMethod, finalPrice) => {
    order = orders.findIndex(o => o.id == id)
    orders[order].products = products
    orders[order].address = address
    orders[order].paymentMethod = paymentMethod
    orders[order].finalPrice = finalPrice
    return orders[order] 
}

// const updateOrder2 = (id, products, address) => {
//     order = orders.findIndex(o => o.id == id)
//     orders[order].products = products
//     orders[order].address = address
//     return orders[order] 
// }

const addOrder = (products, userEmail, address, paymentMethod, finalPrice) => {
    order = {id : orders[orders.length -1].id +1, products, status : 'new', userEmail, address, paymentMethod, finalPrice}
    orders.push(order)
    return order
}

const confirmOrder = (id) => {
    const order = orders.findIndex(o => o.id === id)
    orders[order].status = 'confirmed'
    return orders[order]
}

module.exports = {getOrders, updateStatus, addOrder, updateOrder, confirmOrder}