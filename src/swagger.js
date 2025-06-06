const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Resilient Email Service API',
        version: '1.0.0',
        description: 'A robust email sending service with retry logic and fallback mechanisms',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    paths: {
        '/api/email': {
            post: {
                summary: 'Send an email',
                description: 'Send an email with retry logic and fallback mechanisms',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['to', 'subject', 'body'],
                                properties: {
                                    to: {
                                        type: 'string',
                                        format: 'email',
                                        description: 'Recipient email address',
                                    },
                                    subject: {
                                        type: 'string',
                                        description: 'Email subject',
                                    },
                                    body: {
                                        type: 'string',
                                        description: 'Email body',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Email sent successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                        },
                                        provider: {
                                            type: 'string',
                                        },
                                        messageId: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid request',
                    },
                    '500': {
                        description: 'Server error',
                    },
                },
            },
        },
        '/api/email/{id}': {
            get: {
                summary: 'Get email status',
                description: 'Get the status of a sent email',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'Email message ID',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Email status retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            enum: ['PENDING', 'SUCCESS', 'FAILED', 'RETRYING'],
                                        },
                                        attempts: {
                                            type: 'integer',
                                        },
                                        lastAttempt: {
                                            type: 'string',
                                            format: 'date-time',
                                        },
                                        provider: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Email not found',
                    },
                },
            },
        },
    },
};

module.exports = swaggerDocument; 