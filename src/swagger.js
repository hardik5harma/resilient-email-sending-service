module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'Resilient Email Service API',
        version: '1.0.0',
        description: 'A resilient email service with retry logic, fallback mechanisms, and status tracking',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server'
        }
    ],
    components: {
        schemas: {
            EmailRequest: {
                type: 'object',
                required: ['to', 'subject', 'body'],
                properties: {
                    to: {
                        type: 'string',
                        format: 'email',
                        description: 'Recipient email address'
                    },
                    subject: {
                        type: 'string',
                        description: 'Email subject'
                    },
                    body: {
                        type: 'string',
                        description: 'Email body content'
                    }
                }
            },
            EmailResponse: {
                type: 'object',
                properties: {
                    messageId: {
                        type: 'string',
                        description: 'Unique identifier for the email'
                    },
                    status: {
                        type: 'string',
                        enum: ['pending', 'sent', 'failed'],
                        description: 'Current status of the email'
                    },
                    provider: {
                        type: 'string',
                        description: 'Email provider used to send the email'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Error message'
                    },
                    message: {
                        type: 'string',
                        description: 'Detailed error message'
                    }
                }
            }
        }
    },
    paths: {
        '/api/email': {
            post: {
                summary: 'Send an email',
                description: 'Send an email with retry logic and fallback mechanisms',
                operationId: 'sendEmail',
                tags: ['Email'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/EmailRequest'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Email sent successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/EmailResponse'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Bad request - missing required fields',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/email/{id}': {
            get: {
                summary: 'Get email status',
                description: 'Check the status of a sent email',
                operationId: 'getEmailStatus',
                tags: ['Email'],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        },
                        description: 'Message ID of the email'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Email status retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/EmailResponse'
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Email not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/health': {
            get: {
                summary: 'Health check',
                description: 'Check if the service is running',
                operationId: 'healthCheck',
                tags: ['System'],
                responses: {
                    '200': {
                        description: 'Service is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'healthy'
                                        },
                                        timestamp: {
                                            type: 'string',
                                            format: 'date-time'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/debug/emails': {
            get: {
                summary: 'List all emails',
                description: 'Get a list of all emails in the system (for debugging)',
                operationId: 'listAllEmails',
                tags: ['Debug'],
                responses: {
                    '200': {
                        description: 'List of all emails',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/EmailResponse'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}; 