const db = require('../database/db')


function Product(name, price) {
    this.name = name;
    this.price = price;
}

Product.getAll = async () => {  
    try {
        const products = await db.query('SELECT * FROM product')
        return {products}
    } catch (err) {
        return {err}
    }
}

Product.create = async (product) => {
    const {name, price} = product

    try {
        await db.query('INSERT INTO product (name, price) VALUES (?, ?)', [name, price]);
        return;
    } catch (err) {
        // console.log(err);
        return {err}
        // if (err.code == 'ER_BAD_NULL_ERROR') return 400;
        // return 500;
    }
};

Product.editById = async (id, name, price) => {
    try {
        const product = await db.query('SELECT * FROM product WHERE id = ?', [id])
        if (product.length == 0) throw new Error('IDNF')
        if (!name) name = product[0]['name']
        if (price == undefined) price = product[0]['price']
        await db.query('UPDATE product SET name = ?, price = ? WHERE id = ?', [name, price, id])
        return;
    } catch (err) {
        return {err}
    }
}

Product.deleteById = async (id) => {
    try {
        const result = await db.query('DELETE FROM product WHERE id = ?', [id])
        if(result.affectedRows == 0) throw new Error('NoRowsAffected')
        return;
    } catch (err) {
        return {err}
    }
}

/*
    class Product {

        constructor(name, price) {
            this.name = name
            this.price = price
        }

        create = async () => {

            try {
                await db.query('INSERT INTO product (name, price) VALUES (?, ?)', [this.name, this.price])
                // res.sendStatus(201)
                return 201;
            } catch (err) {
                // if(err.code == 'ER_BAD_NULL_ERROR') return res.sendStatus(400)
                // return res.json(err)
        
                if(err.code == 'ER_BAD_NULL_ERROR') return 400;
                console.log(err)
                return 500;
            }
        }

    }

    const Product = (product) => {
    
    }

*/

module.exports = Product;