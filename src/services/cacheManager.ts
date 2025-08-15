/**
 * Cache manager for handling PWA resource caching
 */

export class CacheManager {
  private readonly CACHE_NAME = 'water-reminder-v1';
  private cachedResources: Set<string> = new Set();

  constructor() {
    this.loadCachedResourcesList();
  }

  /**
   * Cache important resources
   */
  async cacheResources(resources: string[]): Promise<boolean> {
    try {
      if (!('caches' in window)) {
        console.warn('Cache API not supported');
        return false;
      }

      const cache = await caches.open(this.CACHE_NAME);
      await cache.addAll(resources);
      
      // Track cached resources
      resources.forEach(resource => {
        this.cachedResources.add(resource);
      });
      
      this.saveCachedResourcesList();
      return true;
    } catch (error) {
      console.error('Failed to cache resources:', error);
      return false;
    }
  }

  /**
   * Check if a resource is cached
   */
  async isResourceCached(resource: string): Promise<boolean> {
    try {
      if (!('caches' in window)) {
        return this.cachedResources.has(resource);
      }

      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(resource);
      return !!response;
    } catch (error) {
      console.error('Failed to check cache:', error);
      return false;
    }
  }

  /**
   * Get cached resource
   */
  async getCachedResource(resource: string): Promise<Response | null> {
    try {
      if (!('caches' in window)) {
        return null;
      }

      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(resource);
      return response || null;
    } catch (error) {
      console.error('Failed to get cached resource:', error);
      return null;
    }
  }

  /**
   * Cache a single resource
   */
  async cacheResource(resource: string, response: Response): Promise<boolean> {
    try {
      if (!('caches' in window)) {
        return false;
      }

      const cache = await caches.open(this.CACHE_NAME);
      await cache.put(resource, response);
      
      this.cachedResources.add(resource);
      this.saveCachedResourcesList();
      return true;
    } catch (error) {
      console.error('Failed to cache resource:', error);
      return false;
    }
  }

  /**
   * Clear all cached resources
   */
  async clearCache(): Promise<boolean> {
    try {
      if (!('caches' in window)) {
        this.cachedResources.clear();
        this.saveCachedResourcesList();
        return true;
      }

      const deleted = await caches.delete(this.CACHE_NAME);
      this.cachedResources.clear();
      this.saveCachedResourcesList();
      return deleted;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * Get list of cached resources
   */
  getCachedResourcesList(): string[] {
    return Array.from(this.cachedResources);
  }

  /**
   * Load cached resources list from localStorage
   */
  private loadCachedResourcesList(): void {
    try {
      const stored = localStorage.getItem('cached-resources');
      if (stored) {
        const resources = JSON.parse(stored);
        this.cachedResources = new Set(resources);
      }
    } catch (error) {
      console.error('Failed to load cached resources list:', error);
    }
  }

  /**
   * Save cached resources list to localStorage
   */
  private saveCachedResourcesList(): void {
    try {
      const resources = Array.from(this.cachedResources);
      localStorage.setItem('cached-resources', JSON.stringify(resources));
    } catch (error) {
      console.error('Failed to save cached resources list:', error);
    }
  }
}