import { describe, test, expect } from 'vitest';
import { encodeGeohash } from '../platform/spatial/geohash.js';

describe('Geohash Spatial Utility', () => {
  test('encodeGeohash should produce valid string of specified precision', () => {
    const lat = 37.7749;
    const lng = -122.4194;

    const hash7 = encodeGeohash(lat, lng, 7);
    const hash5 = encodeGeohash(lat, lng, 5);

    expect(hash7).toHaveLength(7);
    expect(hash5).toHaveLength(5);
    expect(typeof hash7).toBe('string');
  });

  test('identical coordinates produce identical geohash', () => {
    const hashA = encodeGeohash(40.7128, -74.0060, 7);
    const hashB = encodeGeohash(40.7128, -74.0060, 7);

    expect(hashA).toBe(hashB);
  });
});
