require('dotenv').config();

class MockEmailProvider {
    constructor(name, successRate = null) {
        this.name = name;
        this.successRate = successRate ?? 
            (name === 'Provider1' ? 
                parseFloat(process.env.PROVIDER1_SUCCESS_RATE) || 0.9 : 
                parseFloat(process.env.PROVIDER2_SUCCESS_RATE) || 0.8);
        this.sentEmails = new Map();
        console.log(`Initialized ${name} with success rate: ${this.successRate}`);
    }

    setSuccessRate(rate) {
        if (typeof rate !== 'number' || rate < 0 || rate > 1) {
            throw new Error('Success rate must be a number between 0 and 1');
        }
        this.successRate = rate;
        console.log(`${this.name} success rate updated to: ${rate}`);
    }

    async send(email) {
        console.log(`${this.name} attempting to send email:`, email);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

        // Simulate success/failure based on success rate
        const success = Math.random() < this.successRate;
        
        if (success) {
            const messageId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log(`${this.name} generated messageId:`, messageId);
            
            this.sentEmails.set(email.id, email);
            return {
                success: true,
                provider: this.name,
                messageId: messageId
            };
        }

        console.log(`${this.name} failed to send email:`, email);
        throw new Error(`Failed to send email via ${this.name}`);
    }

    isEmailSent(emailId) {
        const isSent = this.sentEmails.has(emailId);
        console.log(`Checking if email ${emailId} is sent by ${this.name}:`, isSent);
        return isSent;
    }

    // Debug method
    listSentEmails() {
        return Array.from(this.sentEmails.entries());
    }
}

module.exports = MockEmailProvider; 