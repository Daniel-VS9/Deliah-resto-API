const db = require('../database/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function createToken(req, res, next) {
    const {userData} = req

    if(userData) {
        const token = jwt.sign(userData, process.env.ACCESS_TOKEN_KEY)
        req.token = token
        next()
    }else {
        res.sendStatus(500)
    }

}

async function authenticate(req, res, next) {
    const {email, pass} = req.body
    
    try {
        const dbPass = await db.query('SELECT pass FROM user WHERE email = ?', [email])
        if (dbPass.length === 0) return res.sendStatus(401)
        const match = await bcrypt.compare(pass, dbPass[0]['pass']) 
        if (!match) throw new Error('ND')
        const result = await db.query('SELECT id, isAdmin, active FROM user WHERE email = ?', [email])
        
        const user = result[0]
        if(!user) throw new Error('ND')
        if(user.active == 0) throw new Error('INACTIVE')
        
        req.userData = {id : user.id, email, isAdmin : user.isAdmin, status : user.active}

        next()

    } catch (err) {
        console.log(err)
        if (err.message === 'INACTIVE') return res.sendStatus(403)
        if(err.message === 'ND') {
            res.sendStatus(401)
        } else{
            res.sendStatus(500)
        }
    }
}

async function authorizeToken (req, res, next) {
    const authHeather = req.headers['authorization']
    const token = authHeather && authHeather.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    
    try {
        const result = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        // console.log(result)
        const active = await db.query('SELECT * FROM user WHERE id = ?', [result.id])
        // console.log(result.id, active)
        if (active[0]['active'] == 0) throw new Error('INACTIVE') 
        
        req.userData = result

        next()

    } catch (err) {
        // console.log(err)
        res.sendStatus(403)
    }
}

function verifyAdmin (req, res, next) {
    (req.userData && req.userData.isAdmin == 1) ? next() : res.sendStatus(403)
}




module.exports = {authenticate, createToken, authorizeToken, verifyAdmin}