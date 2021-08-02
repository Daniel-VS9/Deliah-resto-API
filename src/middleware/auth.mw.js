const basicAuth = require('express-basic-auth')
const {getUsers} = require('../models/user')

const db = require('../database/db')
const jwt = require('jsonwebtoken')

// TODO
function createToken(req, res, next) {
    const {userData} = req

    if(userData) {
        const token = jwt.sign(userData, process.env.ACCESS_TOKEN_KEY)
        req.token = token
        next()
    }else {
        res.sendStatus(400)
    }

}

async function authenticate(req, res, next) {
    const {email, pass} = req.body

    try {
        const user = await db.query('SELECT id, isAdmin FROM user WHERE email = ? AND pass = ?', [email, pass])

        if(!user[0]) throw new Error('ND')
        
        req.userData = {id : user[0].id, email, isAdmin : user[0].isAdmin}

        // NOTE: For bcrypt?

        next()

    } catch (err) {
        // console.error(err)

        if(err.message == 'ND') {
            res.sendStatus(400)
        } else{
            res.sendStatus(500)
        }
    }
}

function authorizeToken (req, res, next) {
    const authHeather = req.headers['authorization']
    const token = authHeather && authHeather.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    try {
        const result = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        req.userData = result
        next()

    } catch (err) {
        res.sendStatus(403)
    }
}

function verifyAdmin2 (req, res,next) {
    // console.log(req.userData)
    // console.log(req.userData.isAdmin)
    req.userData.isAdmin == 1 ? next() : res.sendStatus(403)
}

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

module.exports = {verifyAdmin, authentication, authenticate, createToken, authorizeToken, verifyAdmin2}