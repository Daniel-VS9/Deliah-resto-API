const PaymentMethod = require('../models/PaymentMethod')


exports.getAll = async (req, res) => {
    const result = await PaymentMethod.getAll();

    if (result.err) return res.sendStatus(500) 
    return res.json(result)
}

exports.create = async (req, res) => {
    const {name} = req.body
    if(!name || typeof(name) !== 'string' || name === "") return res.sendStatus(400)

    const result = await PaymentMethod.create(name)

    if (!result) return res.sendStatus(201)
    return res.sendStatus(500)
}

exports.editById = async (req, res) => {
    const {id} = req.params
    const {name} = req.body
    if(!name || typeof(name) !== 'string' || name === "") return res.sendStatus(400)

    const result = await PaymentMethod.editById(id, name)

    if (!result) return res.sendStatus(204)
    if (result.err.message === 'NRA') return res.sendStatus(404)
    return res.sendStatus(500)
}

exports.deleteById = async (req, res) => {
    const {id} = req.params

    const result = await PaymentMethod.deleteById(id)

    if (!result) return res.sendStatus(204)
    if (result.err.message === 'NRA') return res.sendStatus(404)
    return res.sendStatus(500)
}