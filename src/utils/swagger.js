const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

swagger = {
    info: {
        title: 'API Deliah Resto',
        version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
        '/addresses': {
            get: {
                responses: {
                    200: {
                        description: 'A JSON object containing all the addresses',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Get all addresses',
                tags: ['Addresses'],
            },
        },
        '/addresses/add': {
            post: {
                description: '',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    address: {
                                        type: 'string',
                                    }
                                },
                                example: {
                                    address: '7621 Green Lake St. Levittown, NY 11756'
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Successful operation',
                    },
                    400: {
                        description: 'Bad request',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Add address',
                tags: ['Addresses'],
            },
        },
        '/addresses/myaddresses': {
            get: {
                responses: {
                    200: {
                        description: 'A JSON object containing all the user addresses',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Get my own addresses',
                tags: ['Addresses'],
            },
        },
        '/login': {
            post: {
                description: '',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    email: {
                                        type: 'string',
                                    },
                                    pass: {
                                        type: 'string',
                                    },
                                },
                                example: {
                                    email: 'admin@mail.com',
                                    pass: '1234'
                                }
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'A JSON object containing the user access token',
                    },
                    400: {
                        description: 'Bad request',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Login',
                tags: ['User'],
            },
        },
        '/myorders': {
            get: {
                responses: {
                    200: {
                        description: 'A JSON object containing all the user orders',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Get my orders',
                tags: ['Order'],
            },
        },
        '/order/{id}/status': {
            put: {
                description: '3. New\n\n4. Confirmed\n\n5. In process\n\n6. On the way\n\n 7. Delivered',
                parameters: [
                    {
                        description: '',
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    newStatus: {
                                        type: 'integer',
                                        enum: [3, 4, 5, 6, 7],
                                    }
                                },
                            },
                        },
                    },
                },
                responses: {
                    204: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Order not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Change order status',
                tags: ['Order'],
            },
        },
        '/order/confirm': {
            post: {
                responses: {
                    204: {
                        description: 'Succesful operation',
                    },
                    400: {
                        description: 'No open order',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Confirm order',
                tags: ['Order'],
            },
        },
        '/order/modify': {
            put: {
                description: 'Address, payment method and products are optional. \n\nTo remove a product set quantity to 0.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    address: {
                                        type: 'string or integer'
                                    },
                                    paymentMethod: {
                                        type: 'integer'
                                    },
                                    products: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                name: {
                                                    type: 'string'
                                                },
                                                quantity: {
                                                    type: 'integer'
                                                }
                                            }
                                        }
                                    }
                                },
                                example: {
                                    address: 'Id of address in the address book or write a new address',
                                    paymenthMethod: 2,
                                    products: [
                                        {
                                            name: 'Tomahawk',
                                            quantity: 3
                                        },
                                    ]
                                },
                            },
                        },
                    },
                },
                responses: {
                    204: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Update order',
                tags: ['Order'],
            },
        },
        '/orders': {
            get: {
                responses: {
                    200: {
                        description: 'A JSON object containing all orders',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Get orders',
                tags: ['Order'],
            },
        },
        '/order/new': {
            post: {
                description: '',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    paymentMethod: {
                                        type: 'integer'
                                    },
                                    address: {
                                        type: 'string or integer'
                                    },
                                    products: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: {
                                                    type: 'integer'
                                                },
                                                quantity: {
                                                    type: 'integer'
                                                }
                                            }
                                        }
                                    }
                                },
                                example: {
                                    address: 'Id of address in the address book or write a new address',
                                    paymentMethod: 2,
                                    products: [
                                        {
                                            id: 1,
                                            quantity: 1
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'New order',
                tags: ['Order'],
            },
        },
        '/payments/add': {
            post: {
                description: '',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    name: {
                                        type: 'string',
                                    }
                                },
                                example: {
                                    name: 'Check'
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'New payment method',
                tags: ['Payment method'],
            },
        },
        '/payments/edit/{id}': {
            put: {
                description: '',
                parameters: [
                    {
                        description: '',
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    name: {
                                        type: 'string',
                                    }
                                },
                                example: {
                                    name: 'MasterCard Credit card'
                                }
                            },
                        },
                    },
                },
                responses: {
                    204: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Edit payment method',
                tags: ['Payment method'],
            },
        },
        '/payments/get': {
            get: {
                responses: {
                    200: {
                        description: 'A JSON object containing all payment methods',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Get payment methods',
                tags: ['Payment method'],
            },
        },
        '/payments/delete/{id}': {
            delete: {
                parameters: [
                    {
                        description: '',
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    204: {
                        description: 'successful operation',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Delete payment method by id',
                tags: ['Payment method'],
            },
        },
        '/products': {
            get: {
                responses: {
                    200: {
                        description: 'A JSON object containing all products',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Get products',
                tags: ['Product'],
            },
        },
        '/products/delete/{id}': {
            delete: {
                parameters: [
                    {
                        description: '',
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    204: {
                        description: 'successful operation',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Delete Product by id',
                tags: ['Product'],
            },
        },
        '/products/edit/{id}': {
            put: {
                description: '',
                parameters: [
                    {
                        description: '',
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    price: {
                                        type: 'number'
                                    }
                                },
                                example: {
                                    name: 'Tomahawk deluxe',
                                    price: 20.50
                                }
                            },
                        },
                    },
                },
                responses: {
                    204: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Edit product by id',
                tags: ['Product'],
            },
        },
        '/products/new': {
            post: {
                description: '',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    price: {
                                        type: 'number'
                                    }
                                },
                                example: {
                                    name: 'Brisket',
                                    price: 15.96
                                }
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'New product',
                tags: ['Product'],
            },
        },
        '/register': {
            post: {
                description: '',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    email: {
                                        type: 'string',
                                    },
                                    fullname: {
                                        type: 'string',
                                    },
                                    pass: {
                                        type: 'string',
                                    },
                                    phone: {
                                        type: 'integer'
                                    },
                                    address: {
                                        type: 'string',
                                    },
                                },
                                example: {
                                    email: 'jack@mail.com',
                                    fullname: 'Jack Daniels',
                                    pass: '1234',
                                    phone: 30000000,
                                    address: '2190 North Wichita'
                                }
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'successful operation',
                    },
                    400: {
                        description: 'Information is missing or invalid',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Register',
                tags: ['User'],
            },
        },
        '/users': {
            get: {
                responses: {
                    200: {
                        description: 'A JSON object containing all users',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Get users',
                tags: ['User'],
            },
        },
        '/user/suspend/{id}': {
            put: {
                parameters: [
                    {
                        description: '',
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    204: {
                        description: 'successful operation',
                    },
                    401: {
                        description: 'Authorization information is missing or invalid',
                    },
                    403: {
                        description: 'Forbbiden',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
                summary: 'Suspend user by id',
                tags: ['User'],
            },
        },
    },
    // servers: [
    //     {
    //         url: `http://localhost:${process.env.PORT}`,
    //     },
    // ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        {
            description: '',
            name: 'User',
        },
        {
            description: '',
            name: 'Addresses',
        },
        {
            description: '',
            name: 'Product',
        },
        {
            description: '',
            name: 'Order',
        },
        {
            description: '',
            name: 'Payment method',
        },
    ],
};

module.exports = swagger;
