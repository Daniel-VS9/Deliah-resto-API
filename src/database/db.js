require('dotenv').config('../../.env')
const util = require('util')
const mysql = require('mysql')

const {DB_HOST, DB_NAME, DB_PASSWORD, DB_USER} = process.env

const db = mysql.createConnection({
    host : DB_HOST,
    user : DB_USER,
    password : DB_PASSWORD,
    database : DB_NAME
})

db.connect(err => {
    if(err) throw err.stack
    console.log('Mysql DB connected...')
})

db.query = util.promisify(db.query).bind(db)

module.exports = db