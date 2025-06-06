const EmailService = require('../src/EmailService');

describe('EmailService', () => {
    let emailService;

    beforeEach(() => {
        emailService = new EmailService({
            maxRetries: 3,
            retryDelay: 100,
            maxRequestsPerMinute: 60
        });
    });

    test('should successfully send an email', async () => {
        const emailData = {
            to: 'test@example.com',
            subject: 'Test Email',
            body: 'Hello World'
        };

        const result = await emailService.sendEmail(emailData);
        
        expect(result.success).toBe(true);
        expect(result.provider).toBeDefined();
        expect(result.messageId).toBeDefined();
    });

    test('should handle idempotency', async () => {
        const emailData = {
            to: 'test@example.com',
            subject: 'Test Email',
            body: 'Hello World'
        };

        const result1 = await emailService.sendEmail(emailData);
        const result2 = await emailService.sendEmail(emailData);

        expect(result1).toEqual(result2);
    });

    test('should track email status', async () => {
        const emailData = {
            to: 'test@example.com',
            subject: 'Test Email',
            body: 'Hello World'
        };

        const result = await emailService.sendEmail(emailData);
        const status = emailService.getEmailStatus(result.messageId);

        expect(status).toBeDefined();
        expect(status.status).toBe('SUCCESS');
        expect(status.provider).toBeDefined();
        expect(status.attempts).toBeDefined();
        expect(status.lastAttempt).toBeDefined();
    });

    test('should handle rate limiting', async () => {
        const emailData = {
            to: 'test@example.com',
            subject: 'Test Email',
            body: 'Hello World'
        };

        const startTime = Date.now();
        const promises = Array(10).fill().map(() => emailService.sendEmail(emailData));
        await Promise.all(promises);
        const endTime = Date.now();

        // Should take at least 1 second due to rate limiting
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
    });

    test('should implement circuit breaker pattern', async () => {
        const emailService = new EmailService({
            maxRetries: 1,
            retryDelay: 100,
            failureThreshold: 2
        });

        const emailData = {
            to: 'test@example.com',
            subject: 'Test Email',
            body: 'Hello World'
        };

        // Force failures to trigger circuit breaker
        emailService.providers[0].setSuccessRate(0);
        emailService.providers[1].setSuccessRate(0);

        // Try to send multiple emails to trigger the circuit breaker
        try {
            await emailService.sendEmail(emailData);
        } catch (error) {
            // Expected error
        }

        try {
            await emailService.sendEmail(emailData);
        } catch (error) {
            // Expected error
        }
        
        // Circuit breaker should be open
        expect(emailService.circuitBreakers[0].getState()).toBe('OPEN');
    });

    test('should implement retry with exponential backoff', async () => {
        const emailService = new EmailService({
            maxRetries: 3,
            retryDelay: 100
        });

        const emailData = {
            to: 'test@example.com',
            subject: 'Test Email',
            body: 'Hello World'
        };

        // Make first provider fail
        emailService.providers[0].successRate = 0;
        
        const result = await emailService.sendEmail(emailData);
        
        expect(result.success).toBe(true);
        expect(result.provider).toBe('Provider2');
    });
}); 