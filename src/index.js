require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const EmailService = require('./EmailService');
const logger = require('./utils/logger');
const swaggerDocument = require('./swagger');

const app = express();
const emailService = new EmailService({
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
    maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 60,
    failureThreshold: parseInt(process.env.FAILURE_THRESHOLD) || 5,
    resetTimeout: parseInt(process.env.RESET_TIMEOUT) || 60000
});

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

// Debug endpoint to list all emails
app.get('/api/debug/emails', (req, res) => {
    const allEmails = emailService.listAllEmails();
    res.json(allEmails);
});

// Send email endpoint
app.post('/api/email', async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        
        if (!to || !subject || !body) {
            logger.warn('Missing required fields in email request');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        logger.info('Received email request', { to, subject });
        const result = await emailService.sendEmail({ to, subject, body });
        logger.info('Email sent successfully', { messageId: result.messageId, provider: result.provider });
        res.json(result);
    } catch (error) {
        logger.error('Error sending email', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// Get email status endpoint
app.get('/api/email/:id', (req, res) => {
    const emailId = req.params.id;
    logger.info('Checking status for email', { emailId });
    
    const status = emailService.getEmailStatus(emailId);
    
    if (!status) {
        logger.warn('Email not found', { emailId });
        return res.status(404).json({ 
            error: 'Email not found',
            message: 'The requested email ID does not exist in our system',
            emailId: emailId,
            debug: 'Try sending a new email and use the messageId from the response'
        });
    }
    
    logger.info('Found email status', { emailId, status });
    res.json(status);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
}); 