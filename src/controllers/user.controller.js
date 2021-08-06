const User = require('../models/User');
const bcrypt = require('bcrypt')

exports.getAll = async (req, res) => {
    const result = await User.getAll();

    if (result.users) return res.json(result.users);
    if (result.err) return res.sendStatus(500);
};

exports.create = async (req, res) => {
    const { email, fullname, pass, phone, address } = req.body;
    if (!email || !fullname || !pass || !phone || !address) return res.sendStatus(400);

    const hashed = await bcrypt.hash(pass, 10)

    const user = new User(fullname, email, hashed, phone, address);
    const result = await User.create(user);

    if (!result) return res.sendStatus(201);
    if ( result.err.code == 'ER_BAD_NULL_ERROR' || result.err.code == 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' ) return res.sendStatus(400);
}