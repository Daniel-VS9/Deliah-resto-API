const redis = require('redis')
require('dotenv').config('../../.env')
const {promisify} = require('util')

const REDIS_PORT = process.env.REDIS_PORT || 6379

const client = redis.createClient(REDIS_PORT)

client.on('err', function(err) {
    console.error(err)
})

client.get = promisify(client.get)

module.exports = client