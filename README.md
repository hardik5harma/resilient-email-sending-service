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

Response:
{
    "success": true,
    "messageId": "mock-1234567890-abc123",
    "provider": "Provider1"
}
```

### Check Email Status
```
GET /api/email/{messageId}

Response:
{
    "status": "SUCCESS",
    "attempts": 1,
    "lastAttempt": "2024-01-01T12:00:00.000Z",
    "provider": "Provider1"
}
```

Possible status values:
- `PENDING`: Email is queued for sending
- `SUCCESS`: Email was sent successfully
- `FAILED`: Email sending failed
- `RETRYING`: Email is being retried with a different provider

### Health Check
```
GET /health

Response:
{
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Debug Endpoint
```
GET /api/debug/emails

Response:
{
    "sentEmails": [...],
    "statuses": [...]
}
```

## Environment Variables

Configure the service using these environment variables:

```
PORT=3000                    # Server port
MAX_RETRIES=3               # Maximum number of retry attempts
RETRY_DELAY=1000            # Base delay between retries (ms)
MAX_REQUESTS_PER_MINUTE=60  # Rate limit per provider
FAILURE_THRESHOLD=5         # Circuit breaker failure threshold
RESET_TIMEOUT=60000         # Circuit breaker reset timeout (ms)
PROVIDER1_SUCCESS_RATE=0.9  # Success rate for Provider1
PROVIDER2_SUCCESS_RATE=0.8  # Success rate for Provider2
LOG_LEVEL=info             # Logging level
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

6. Add the environment variables listed above

7. Click "Create Web Service"

## Architecture

The service is built with the following components:

- `EmailService`: Main service class that orchestrates email sending
- `MockEmailProvider`: Simulated email provider with configurable success rate
- `RateLimiter`: Implements rate limiting per provider
- `CircuitBreaker`: Implements circuit breaker pattern for fault tolerance
- `Logger`: Winston-based logging system

## Error Handling

The service implements several error handling mechanisms:

1. **Retry Logic**: Automatically retries failed emails with exponential backoff
2. **Fallback Providers**: Switches to alternative providers on failure
3. **Circuit Breaker**: Prevents overwhelming failing providers
4. **Rate Limiting**: Prevents provider overload
5. **Idempotency**: Prevents duplicate sends

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
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