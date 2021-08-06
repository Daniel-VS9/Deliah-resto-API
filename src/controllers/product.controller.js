const Product = require('../models/Product')
const redisClient = require('../cache/redis')

exports.create = async (req, res) => {

    const {name, price} = req.body
    if (!name || name === '' || !price) return res.sendStatus(400)
    
    const newProduct = new Product( name, price )
    const result = await Product.create(newProduct)

    if (result && result.err.code == 'ER_BAD_NULL_ERROR') return res.sendStatus(400)
    if (result && result.err.code === 'ER_DUP_ENTRY') return res.status(400).json({err: 'this product already exist'})
    if (result) return res.sendStatus(500)
    redisClient.EXPIRE('products', 1) 
    return res.sendStatus(201)
}

exports.getAll = async (req, res) => {

    try {
        let productsFromCache = await redisClient.get('products')
        productsFromCache = JSON.parse(productsFromCache)
        if (productsFromCache !== null ) return res.json({productsFromCache})
    } catch (err) {
        return res.json(err)
    }

    const result = await Product.getAll()

    if (result.products) {
        const productsString = JSON.stringify(result.products)
        redisClient.set('products', productsString)
        
        return res.json(result.products)
    }
    return res.sendStatus(500)
}

exports.editById = async (req, res) => {
    const {id} = req.params
    let {name, price} = req.body

    const result = await Product.editById(id, name, price)

    if (result && result.err.message === 'IDNF') return res.sendStatus(404)
    if (result && result.err.code === 'ER_DUP_ENTRY') return res.status(400).json({err: 'exist other product with the same name'})
    if (result) return res.sendStatus(500)
    redisClient.EXPIRE('products', 1)
    return res.sendStatus(204) 
}


exports.deleteById = async (req, res) => {
    const {id} = req.params

    const result = await Product.deleteById(id)

    if (result && result.err.message === 'NoRowsAffected') return res.sendStatus(404)
    if (result) return res.sendStatus(500)
    redisClient.EXPIRE('products', 1)
    res.sendStatus(204)
}