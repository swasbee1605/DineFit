class BrowserCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttlTimers = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    };
    this.options = {
      stdTTL: options.stdTTL || 600, 
      checkperiod: options.checkperiod || 120, 
      useClones: options.useClones !== false,
      deleteOnExpire: options.deleteOnExpire !== false,
      enableLegacyCallbacks: options.enableLegacyCallbacks !== false,
      maxKeys: options.maxKeys || 1000
    };
    this.cleanupInterval = setInterval(() => {
      this.checkExpired();
    }, this.options.checkperiod * 1000);
  }
  set(key, value, ttl) {
    if (this.ttlTimers.has(key)) {
      clearTimeout(this.ttlTimers.get(key));
      this.ttlTimers.delete(key);
    }
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.stats.keys--;
    }
    if (this.cache.size >= this.options.maxKeys) {
      const firstKey = this.cache.keys().next().value;
      this.del(firstKey);
    }
    const cacheValue = this.options.useClones ? this.deepClone(value) : value;
    this.cache.set(key, {
      value: cacheValue,
      created: Date.now()
    });
    this.stats.keys++;
    this.updateSizeStats();
    const finalTtl = ttl !== undefined ? ttl : this.options.stdTTL;
    if (finalTtl > 0) {
      const timer = setTimeout(() => {
        this.del(key);
      }, finalTtl * 1000);
      this.ttlTimers.set(key, timer);
    }
    return true;
  }
  get(key) {
    if (!this.cache.has(key)) {
      this.stats.misses++;
      return undefined;
    }
    const item = this.cache.get(key);
    this.stats.hits++;
    return this.options.useClones ? this.deepClone(item.value) : item.value;
  }
  mget(keys) {
    const result = {};
    keys.forEach(key => {
      const value = this.get(key);
      if (value !== undefined) {
        result[key] = value;
      }
    });
    return result;
  }
  del(key) {
    if (!this.cache.has(key)) {
      return 0;
    }
    if (this.ttlTimers.has(key)) {
      clearTimeout(this.ttlTimers.get(key));
      this.ttlTimers.delete(key);
    }
    this.cache.delete(key);
    this.stats.keys--;
    this.updateSizeStats();
    return 1;
  }
  has(key) {
    return this.cache.has(key);
  }
  keys() {
    return Array.from(this.cache.keys());
  }
  getStats() {
    return {
      ...this.stats,
      hitRatio: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }
  flushAll() {
    this.ttlTimers.forEach(timer => clearTimeout(timer));
    this.ttlTimers.clear();
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    };
  }
  getTtl(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    if (!this.ttlTimers.has(key)) {
      return 0; // No expiration
    }
    const item = this.cache.get(key);
    const elapsed = (Date.now() - item.created) / 1000;
    const remaining = this.options.stdTTL - elapsed;
    return Math.max(0, Math.floor(remaining));
  }
  ttl(key, ttl) {
    if (!this.cache.has(key)) {
      return false;
    }
    if (this.ttlTimers.has(key)) {
      clearTimeout(this.ttlTimers.get(key));
      this.ttlTimers.delete(key);
    }
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.del(key);
      }, ttl * 1000);
      this.ttlTimers.set(key, timer);
    }
    return true;
  }
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.warn('Failed to clone object, returning reference:', error);
      return obj;
    }
  }
  updateSizeStats() {
    try {
      let ksize = 0;
      let vsize = 0;
      for (const [key, item] of this.cache) {
        ksize += key.length * 2; // Rough estimate for string size
        vsize += JSON.stringify(item.value).length * 2; // Rough estimate
      }
      this.stats.ksize = ksize;
      this.stats.vsize = vsize;
    } catch (error) {
    }
  }
  checkExpired() {
  }
  close() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.ttlTimers.forEach(timer => clearTimeout(timer));
    this.ttlTimers.clear();
    this.cache.clear();
  }
}
export default BrowserCache;
