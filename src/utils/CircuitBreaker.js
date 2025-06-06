class CircuitBreaker {
    constructor(failureThreshold = 5, resetTimeout = 60000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
        this.failures = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF-OPEN
        this.consecutiveFailures = 0;
    }

    async execute(fn) {
        if (this.state === 'OPEN') {
            if (this.shouldReset()) {
                this.state = 'HALF-OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        if (this.state === 'HALF-OPEN') {
            this.state = 'CLOSED';
        }
        this.consecutiveFailures = 0;
        this.failures = 0;
    }

    onFailure() {
        this.consecutiveFailures++;
        this.failures++;
        this.lastFailureTime = Date.now();
        
        if (this.state === 'HALF-OPEN' || this.consecutiveFailures >= this.failureThreshold) {
            console.log(`Circuit breaker opening after ${this.consecutiveFailures} consecutive failures`);
            this.state = 'OPEN';
        }
    }

    shouldReset() {
        if (!this.lastFailureTime) return false;
        const timeSinceLastFailure = Date.now() - this.lastFailureTime;
        console.log(`Time since last failure: ${timeSinceLastFailure}ms, reset timeout: ${this.resetTimeout}ms`);
        return timeSinceLastFailure >= this.resetTimeout;
    }

    getState() {
        return this.state;
    }
}

module.exports = CircuitBreaker; 