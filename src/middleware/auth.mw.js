const basicAuth = require('express-basic-auth')
const {getUsers} = require('../models/user')

function verifyAdmin(req, res, next) {
    const auth = decode(req.headers.authorization)
    getUsers().find(u => u.email === auth[0] && u.isAdmin) ? next() : res.sendStatus(403)
}

function decode(authHeather) {
    return Buffer.from(authHeather.substring(6), 'base64').toString('ascii').split(':')
}

function authentication(email, pass) {
    const user = getUsers().filter(u => u.email === email && u.pass === pass)[0]
    if (!user) return false 

    const userMatch = basicAuth.safeCompare(email, user.email)
    const passMatch = basicAuth.safeCompare(pass, user.pass)
    if (userMatch & passMatch) {return true} else return false
}

module.exports = {verifyAdmin, authentication}