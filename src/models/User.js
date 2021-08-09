const db = require('../database/db');

function User(fullname, email, pass, phone, address) {
    this.fullname = fullname;
    this.email = email;
    this.pass = pass;
    this.phone = phone;
    this.address = address;
}

User.getAll = async () => {
    try {
        const users = await db.query('SELECT * FROM user');
        return { users };
    } catch (err) {
        return { err };
    }
};

User.create = async (user) => {

    const {fullname, email, pass, phone, address} = user

    try {
        await db.query('START TRANSACTION')
        const result = await db.query('INSERT INTO user (email, fullname, pass, phone) VALUES (?, ?, ?, ?)', [email, fullname, pass, phone])
        userId = result.insertId
        await db.query('INSERT INTO address (body, userID) values (?, ?)', [address, userId])
        await db.query('COMMIT')
        return;
    } catch (err) {
        // console.log(err)
        await db.query('ROLLBACK')
        return {err}
    }
}

User.suspendById = async (id) => {
    try {
        const result = await db.query('UPDATE user SET active = 0 WHERE id = ?', [id])
        if (result.affectedRows == 0) throw new Error('NF')
        return;
    } catch (err) {
        return {err}
    }
}

module.exports = User;
