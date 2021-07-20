const path = require('path')
require('dotenv').config({path : path.resolve(__dirname, '../../.env') })

const swaggerOptions = {
    definition : {
        openapi: '3.0.0',
        info: {
            title: 'Deliah Resto API',
            version: '0.0.1',
        },
        servers: [
            {url: `http://localhost:${process.env.PORT}`}
        ],
        components: {
            securitySchemes: {
                basicAuth: {
                    type: "http",
                    scheme: "basic"
                }
            }
        },
        security: [
            {
                basicAuth: []
            }
        ]
    },
    apis : ['./src/routes/*.js']
}

module.exports = swaggerOptions