// Simple in-memory cache for market data
// In production, consider using Redis for distributed caching

class Cache {
    constructor() {
        this.cache = new Map();
        this.ttl = 60000; // 1 minute default TTL
    }

    set(key, value, ttl = this.ttl) {
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, { value, expiresAt });
    }

    get(key) {
        const item = this.cache.get(key);

        if (!item) {
            return null;
        }

        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    delete(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    // Clean up expired entries periodically
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

// Create singleton instance
const cache = new Cache();

// Run cleanup every 5 minutes
setInterval(() => cache.cleanup(), 5 * 60 * 1000);

module.exports = cache;
