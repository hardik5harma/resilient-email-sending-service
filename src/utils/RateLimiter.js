class RateLimiter {
    constructor(maxRequests, timeWindow) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow; // in milliseconds
        this.requests = [];
    }

    async checkLimit() {
        const now = Date.now();
        
        // Remove old requests
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.timeWindow - (now - oldestRequest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.requests.push(now);
        return true;
    }
}

module.exports = RateLimiter; 