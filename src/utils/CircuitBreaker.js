class CircuitBreaker {
    constructor(failureThreshold = 5, resetTimeout = 60000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
        this.failures = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF-OPEN
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
        this.failures = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }

    shouldReset() {
        if (!this.lastFailureTime) return false;
        return Date.now() - this.lastFailureTime >= this.resetTimeout;
    }

    getState() {
        return this.state;
    }
}

module.exports = CircuitBreaker; 