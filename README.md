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

## Testing with Postman

### Base URLs
- Local: `http://localhost:3000`
- Render: `https://resilient-email-sending-service-p55n.onrender.com`

### 1. Send Email
```
POST {base_url}/api/email
Content-Type: application/json

Request Body:
{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "body": "Hello World"
}

Response (200 OK):
{
    "success": true,
    "messageId": "mock-1234567890-abc123",
    "provider": "Provider1"
}
```

### 2. Check Email Status
```
GET {base_url}/api/email/{messageId}

Response (200 OK):
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

### 3. Health Check
```
GET {base_url}/health

Response (200 OK):
{
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Debug Endpoint
```
GET {base_url}/api/debug/emails

Response (200 OK):
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
