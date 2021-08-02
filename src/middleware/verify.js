const db = require('../database/db')

async function verifyEmail2(req, res, next) {
    const {email} = req.body

    try {
        const result = await db.query('SELECT id FROM user WHERE email = ?', [email])

        if (result[0]) {
            throw new Error('EE')
        } else next()
    } catch (err) {
        if (err.message == 'EE') {
            res.status(400).json({'err' : 'the email is already registered'})
        } else res.json(err)
        
    }
}

async function previousOrderCheck(userId) {

    try {
        const previousOrder = await db.query('SELECT status_id, id FROM order_ WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId])

        if (previousOrder[0] && previousOrder[0]['status_id'] == 3) return [true, previousOrder[0]['id']]
        return false
    } catch (err) {
        res.sendStatus(500)
    }
}

async function verifyOpenOrder(req, res, next) {
    const userId = req.userData.id;
    const check = await previousOrderCheck(userId);
    req.userData.lastOrderId = check[1];

    if (check[0]) return next();
    res.status(400).json({ err: 'no open order' });
}

async function verifyClosedOrder(req, res, next) {
    const userId = req.userData.id;
    const check = await previousOrderCheck(userId);

    if (!check[0]) return next();
    res.status(400).json({ err: 'already has an open order' });
}

module.exports = {verifyEmail2, verifyOpenOrder, verifyClosedOrder}