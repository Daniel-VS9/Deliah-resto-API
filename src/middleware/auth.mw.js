const basicAuth = require('express-basic-auth')
const {getUsers} = require('../models/user')

const db = require('../database/db')
const jwt = require('jsonwebtoken')

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

function verifyAdmin (req, res,next) {
    req.userData.isAdmin == 1 ? next() : res.sendStatus(403)
}




module.exports = {authenticate, createToken, authorizeToken, verifyAdmin}