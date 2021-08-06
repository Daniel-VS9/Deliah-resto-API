const Product = require('../models/Product')

exports.create = async (req, res) => {

    const {name, price} = req.body
    
    const newProduct = new Product( name, price )
    const result = await Product.create(newProduct)
    // TODO: UPDATE MODE OF SEND RESPONSES
    res.sendStatus(result)
}

exports.getAll = async (req, res) => {
    const result = await Product.getAll()

    if (result.products) return res.json(result.products)
    return res.sendStatus(500)
}

exports.editById = async (req, res) => {
    const {id} = req.params
    let {name, price} = req.body

    const result = await Product.editById(id, name, price)

    if (result && result.err.message === 'IDNF') return res.sendStatus(404)
    if (result) return res.sendStatus(500)
    return res.sendStatus(204) 
}


exports.deleteById = async (req, res) => {
    const {id} = req.params

    const result = await Product.deleteById(id)

    if (result && result.err.message === 'NoRowsAffected') return res.sendStatus(404)
    if (result) return res.sendStatus(500)
    res.sendStatus(204)
}