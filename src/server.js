const express = require('express');
const app = express();
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const { authorizeToken } = require('./middleware/auth.mw');

require('./database/db');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

PORT = process.env.PORT || 5000;

const swaggerOptions = require('./utils/swagger');

app.use(express.json());
app.use(helmet());

// Routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));
app.use('/', require('./routes/users'));
app.use(authorizeToken);
app.use('/products', require('./routes/products'));
app.use('/', require('./routes/orders'));
app.use('/payments', require('./routes/payments'));
app.use('/user', require('./routes/users'));
app.use('/users', require('./routes/users'));
app.use('/addresses', require('./routes/addressBook'))

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
