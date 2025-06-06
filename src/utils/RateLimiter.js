class RateLimiter {
    constructor(maxRequests, timeWindow) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow; // in milliseconds
        this.requests = [];
        this.lastRequestTime = 0;
    }

    async checkLimit() {
        const now = Date.now();
        
        // Remove old requests
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        // Calculate minimum time between requests
        const minTimeBetweenRequests = this.timeWindow / this.maxRequests;
        
        // If we've made requests, ensure minimum time has passed
        if (this.lastRequestTime > 0) {
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < minTimeBetweenRequests) {
                const waitTime = minTimeBetweenRequests - timeSinceLastRequest;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        
        // If we're at max requests, wait for the window to clear
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.timeWindow - (now - oldestRequest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.lastRequestTime = Date.now();
        this.requests.push(this.lastRequestTime);
        return true;
    }
}

module.exports = RateLimiter; 