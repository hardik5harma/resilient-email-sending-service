# Resilient Email Service

A robust email sending service implementation with retry logic, fallback mechanisms, and rate limiting.

## Features

- Retry mechanism with exponential backoff
- Fallback between multiple email providers
- Idempotency to prevent duplicate sends
- Rate limiting
- Status tracking for email sending attempts
- Circuit breaker pattern
- Simple logging
- Basic queue system

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Start the service:
```bash
npm start
```

## Architecture

The service is built with the following components:

- `EmailService`: Main service class that orchestrates email sending
- Mock Email Providers: Simulated email providers for testing
- Rate Limiter: Controls the rate of email sending
- Circuit Breaker: Prevents cascading failures
- Queue System: Manages email sending requests

## Assumptions

1. The service uses mock email providers instead of real ones
2. Email sending is asynchronous
3. Rate limits are configurable per provider
4. Retry attempts are configurable
5. Circuit breaker thresholds are configurable

## Usage

```javascript
const emailService = new EmailService();

// Send an email
const result = await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Test Email',
  body: 'Hello World'
});
```

## Testing

The project includes comprehensive unit tests. Run them using:

```bash
npm test
``` 