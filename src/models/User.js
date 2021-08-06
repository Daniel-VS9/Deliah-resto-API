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
        await db.query('INSERT INTO user (email, fullname, pass, phone, address) VALUES (?, ?, ?, ?, ?)', [email, fullname, pass, phone, address])
        return;
    } catch (err) {
        return {err}
    }
}

module.exports = User;
