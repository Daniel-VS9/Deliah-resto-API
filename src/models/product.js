const products = [
    {
        id : 1,
        name : 'plato 1',
        price : 9.99
    },
    {
        id : 2,
        name : 'plato 2',
        price : 10.99
    },
    {
        id : 3,
        name : 'plato 3',
        price : 7.99
    }
]

const getProducts = () => {
    const allProducts = []
    // Deep copy of products list
    for (let i = 0; i < products.length; i++) {
        allProducts[i] = {}
        for(let prop in products[i]) {
            allProducts[i][prop] = products[i][prop]
        }
        
    }
    return allProducts
}

const addProduct = (name, price) => {
    product = {id : products[products.length -1].id +1, name, price}
    products.push(product)
}

const updateProduct = (id, name, price) => {
    product = products.findIndex(p => p.id == id)
    products[product].name = name
    products[product].price = price
    return "product successfully updapted"
}

const deleteProduct = (index) => {
    products.splice(index, 1)
}

module.exports = {getProducts, addProduct, updateProduct, deleteProduct}