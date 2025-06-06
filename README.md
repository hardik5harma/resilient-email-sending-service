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
- API Documentation with Swagger
- Professional logging with Winston

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

## API Documentation

Once the server is running, access the API documentation at:
```
http://localhost:3000/api-docs
```

## Deployment

### Deploying to Render

1. Fork this repository to your GitHub account

2. Go to [Render Dashboard](https://dashboard.render.com/)

3. Click "New +" and select "Web Service"

4. Connect your GitHub repository

5. Configure the service:
   - Name: `resilient-email-service`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`

6. Add the following environment variables:
   ```
   PORT=3000
   MAX_RETRIES=3
   RETRY_DELAY=1000
   MAX_REQUESTS_PER_MINUTE=60
   FAILURE_THRESHOLD=5
   RESET_TIMEOUT=60000
   PROVIDER1_SUCCESS_RATE=0.9
   PROVIDER2_SUCCESS_RATE=0.8
   LOG_LEVEL=info
   ```

7. Click "Create Web Service"

## API Endpoints

### Send Email
```
POST /api/email
Content-Type: application/json

{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "body": "Hello World"
}
```

### Check Email Status
```
GET /api/email/{messageId}
```

### Health Check
```
GET /health
```

## Architecture

The service is built with the following components:

- `EmailService`: Main service class that orchestrates email sending
- Mock Email Providers: Simulated email providers for testing
- Rate Limiter: Controls the rate of email sending
- Circuit Breaker: Prevents cascading failures
- Queue System: Manages email sending requests
- Swagger UI: API documentation
- Winston Logger: Professional logging system

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

The project includes comprehensive unit tests and integration tests. Run them using:

```bash
npm test
```

For test coverage:
```bash
npm run test:coverage
```

## Logging

Logs are stored in:
- `error.log`: Contains error logs
- `combined.log`: Contains all logs

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 