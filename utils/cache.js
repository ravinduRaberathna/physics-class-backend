/**
 * High-performance, zero-dependency in-memory cache for high-concurrency traffic.
 * Handles TTL expiration and instant cache invalidation upon admin mutations.
 */
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Get cached value if exists and not expired
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set cached value with TTL in seconds
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds default: 600 (10 minutes)
   */
  set(key, value, ttlSeconds = 600) {
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Delete a specific cache key
   * @param {string} key
   */
  del(key) {
    this.store.delete(key);
  }

  /**
   * Delete all keys that start with a prefix (e.g. 'classes_', 'blogs_')
   * @param {string} prefix
   */
  clearPrefix(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache store
   */
  flush() {
    this.store.clear();
  }
}

const cache = new MemoryCache();
module.exports = cache;

