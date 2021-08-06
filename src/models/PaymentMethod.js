const db = require('../database/db')

function PaymentMethod(name) {
    this.name = name;
}

PaymentMethod.getAll = async () => {
    try {
        const methods = await db.query('SELECT * FROM payment_method')
        return methods;
    } catch (err) {
        return {err}
    }
}

PaymentMethod.create = async (name) => {
    try {
        await db.query('INSERT INTO payment_method (name) VALUES (?)', [name])
        return;
    } catch (err) {
        return {err}
    }
}

PaymentMethod.editById = async (id, name) => {
    try {
        const result = await db.query('UPDATE payment_method SET name = ? WHERE id = ?', [name, id])
        if(result.affectedRows == 0) throw new Error('NRA')
        return;
    } catch (err) {
        return {err}
    }
}

PaymentMethod.deleteById = async (id) => {
    try {
        const result = await db.query('DELETE FROM payment_method WHERE id = ?', [id])
        if(result.affectedRows == 0) throw new Error('NRA')
        return;
    } catch (err) {
        return {err}
    }
}

module.exports = PaymentMethod