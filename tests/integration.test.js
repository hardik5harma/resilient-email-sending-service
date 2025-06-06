const request = require('supertest');
const express = require('express');
const EmailService = require('../src/EmailService');

describe('Email Service Integration Tests', () => {
    let app;
    let emailService;

    beforeEach(() => {
        emailService = new EmailService({
            maxRetries: 1,
            retryDelay: 100
        });
        
        app = express();
        app.use(express.json());
        
        // Email endpoints
        app.post('/api/email', async (req, res) => {
            try {
                const { to, subject, body } = req.body;
                if (!to || !subject || !body) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                const result = await emailService.sendEmail({ to, subject, body });
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/api/email/:id', (req, res) => {
            const status = emailService.getEmailStatus(req.params.id);
            if (!status) {
                return res.status(404).json({ error: 'Email not found' });
            }
            res.json(status);
        });
    });

    test('should send email successfully', async () => {
        const response = await request(app)
            .post('/api/email')
            .send({
                to: 'test@example.com',
                subject: 'Test Email',
                body: 'Hello World'
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.messageId).toBeDefined();
        expect(response.body.provider).toBeDefined();
    });

    test('should return 400 for missing fields', async () => {
        const response = await request(app)
            .post('/api/email')
            .send({
                to: 'test@example.com'
                // missing subject and body
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required fields');
    });

    test('should get email status', async () => {
        // First send an email
        const sendResponse = await request(app)
            .post('/api/email')
            .send({
                to: 'test@example.com',
                subject: 'Test Email',
                body: 'Hello World'
            });

        const messageId = sendResponse.body.messageId;

        // Then check its status
        const statusResponse = await request(app)
            .get(`/api/email/${messageId}`);

        expect(statusResponse.status).toBe(200);
        expect(statusResponse.body.status).toBe('SUCCESS');
        expect(statusResponse.body.provider).toBeDefined();
    });

    test('should return 404 for non-existent email', async () => {
        const response = await request(app)
            .get('/api/email/non-existent-id');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Email not found');
    });
}); 