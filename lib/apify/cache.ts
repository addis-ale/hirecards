/**
 * Simple in-memory cache for LinkedIn scraping results
 * Reduces API calls and costs
 */

import { LinkedInJobResult } from "./linkedin-scraper";

interface CacheEntry {
  data: LinkedInJobResult[];
  timestamp: number;
}

// In-memory cache
const cache = new Map<string, CacheEntry>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate cache key from job data
 */
export function generateCacheKey(jobTitle: string, location: string): string {
  const normalizedTitle = jobTitle.toLowerCase().trim().replace(/\s+/g, "-");
  const normalizedLocation = location.toLowerCase().trim().replace(/\s+/g, "-");
  return `${normalizedTitle}__${normalizedLocation}`;
}

/**
 * Get cached LinkedIn results
 */
export function getCachedResults(
  jobTitle: string,
  location: string
): LinkedInJobResult[] | null {
  const key = generateCacheKey(jobTitle, location);
  const entry = cache.get(key);

  if (!entry) {
    console.log(`📭 Cache MISS for: ${key}`);
    return null;
  }

  // Check if cache is expired
  const now = Date.now();
  const age = now - entry.timestamp;

  if (age > CACHE_DURATION) {
    console.log(`⏰ Cache EXPIRED for: ${key} (age: ${Math.round(age / 1000 / 60)} minutes)`);
    cache.delete(key);
    return null;
  }

  console.log(`✅ Cache HIT for: ${key} (age: ${Math.round(age / 1000 / 60)} minutes)`);
  return entry.data;
}

/**
 * Set cached LinkedIn results
 */
export function setCachedResults(
  jobTitle: string,
  location: string,
  data: LinkedInJobResult[]
): void {
  const key = generateCacheKey(jobTitle, location);
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
  console.log(`💾 Cached ${data.length} results for: ${key}`);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
  console.log("🗑️ Cache cleared");
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
