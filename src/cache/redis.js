const redis = require('redis')
require('dotenv').config('../../.env')
const {promisify} = require('util')

const REDIS_URL = process.env.REDIS_URL

const client = redis.createClient(REDIS_URL)

client.on('err', function(err) {
    console.error(err)
})

client.get = promisify(client.get)

module.exports = client