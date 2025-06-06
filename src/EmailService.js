const { v4: uuidv4 } = require('uuid');
const MockEmailProvider = require('./providers/MockEmailProvider');
const RateLimiter = require('./utils/RateLimiter');
const CircuitBreaker = require('./utils/CircuitBreaker');

class EmailService {
    constructor(options = {}) {
        this.providers = [
            new MockEmailProvider('Provider1', 0.9),
            new MockEmailProvider('Provider2', 0.8)
        ];
        
        this.rateLimiters = this.providers.map(provider => 
            new RateLimiter(options.maxRequestsPerMinute || 60, 60000)
        );
        
        this.circuitBreakers = this.providers.map(provider => 
            new CircuitBreaker(options.failureThreshold || 5, options.resetTimeout || 60000)
        );
        
        this.maxRetries = options.maxRetries || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.sentEmails = new Map();
        this.statuses = new Map();

        // Log initial state
        console.log('EmailService initialized with options:', options);
    }

    async sendEmail(emailData) {
        const emailId = uuidv4();
        const email = { ...emailData, id: emailId };
        
        // Check idempotency using a hash of the email content
        const emailHash = JSON.stringify({ to: emailData.to, subject: emailData.subject, body: emailData.body });
        if (this.sentEmails.has(emailHash)) {
            return this.sentEmails.get(emailHash);
        }

        this.statuses.set(emailId, {
            status: 'PENDING',
            attempts: 0,
            lastAttempt: null,
            provider: null
        });

        try {
            const result = await this.sendWithRetry(email);
            // Store both by hash and messageId for proper tracking
            this.sentEmails.set(emailHash, result);
            this.sentEmails.set(result.messageId, result);
            
            this.statuses.set(result.messageId, {
                status: 'SUCCESS',
                attempts: 1,
                lastAttempt: new Date().toISOString(),
                provider: result.provider
            });
            
            return result;
        } catch (error) {
            this.updateStatus(emailId, 'FAILED');
            console.error('Failed to send email:', emailId, error);
            throw error;
        }
    }

    async sendWithRetry(email, attempt = 0) {
        if (attempt >= this.maxRetries) {
            throw new Error('Max retry attempts reached');
        }

        const providerIndex = attempt % this.providers.length;
        const provider = this.providers[providerIndex];
        const rateLimiter = this.rateLimiters[providerIndex];
        const circuitBreaker = this.circuitBreakers[providerIndex];

        try {
            await rateLimiter.checkLimit();
            
            const result = await circuitBreaker.execute(async () => {
                return await provider.send(email);
            });

            return result;
        } catch (error) {
            this.updateStatus(email.id, 'RETRYING', provider.name, attempt + 1);
            
            // Exponential backoff
            const delay = this.retryDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return this.sendWithRetry(email, attempt + 1);
        }
    }

    updateStatus(emailId, status, provider = null, attempts = null) {
        const currentStatus = this.statuses.get(emailId);
        if (!currentStatus) return;
        
        const newStatus = {
            ...currentStatus,
            status,
            provider: provider || currentStatus.provider,
            attempts: attempts || currentStatus.attempts,
            lastAttempt: new Date().toISOString()
        };
        this.statuses.set(emailId, newStatus);
        console.log('Updated status for email:', emailId, newStatus);
    }

    getEmailStatus(messageId) {
        console.log('Checking status for messageId:', messageId);
        console.log('Available statuses:', 
            Array.from(this.statuses.entries()).map(([id, status]) => ({
                id,
                status: status.status,
                provider: status.provider
            }))
        );
        return this.statuses.get(messageId);
    }

    isEmailSent(messageId) {
        return this.sentEmails.has(messageId);
    }

    // Debug method to list all emails
    listAllEmails() {
        return {
            sentEmails: Array.from(this.sentEmails.entries()),
            statuses: Array.from(this.statuses.entries())
        };
    }
}

module.exports = EmailService; 