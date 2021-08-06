const express = require('express');
const app = express();
// const redis = require('redis')
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const { authorizeToken } = require('./middleware/auth.mw');

require('./database/db');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

PORT = process.env.PORT || 5000;
// REDIS_PORT = process.env.REDIS_PORT || 6379
// const redisClient = redis.createClient()
// const r = require('./cache/redis')

const swaggerOptions = require('./utils/swaggerOptions');
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(helmet());

// Routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/', require('./routes/users'));
app.use(authorizeToken);
app.use('/products', require('./routes/products'));
app.use('/', require('./routes/orders'));
app.use('/payments', require('./routes/payments'));

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
