const express = require('express')
const app = express()
const basicAuth = require('express-basic-auth')
const { authentication, authorizeToken } = require('./middleware/auth.mw')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const path = require('path')
const db = require('./database/db')

require('dotenv').config({path : path.resolve(__dirname, '../.env')})

PORT = process.env.PORT || 3000

const swaggerOptions = require('./utils/swaggerOptions')
const swaggerDocs = swaggerJsdoc(swaggerOptions)

app.use(express.json())

// Routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use('/', require('./routes/users'))

app.use(authorizeToken)

app.use('/products', require('./routes/products'))
// app.use('/user', require('./routes/users'))
app.use('/', require('./routes/orders'))
app.use('/payments', require('./routes/payments'))

app.listen(PORT, () => {console.log(`Running on port ${PORT}`);})