import { describe, test, expect } from 'vitest';
import {
  haversineDistanceMeters,
  computeDirectionalCosineSimilarity,
  computeRouteSimilarityScore,
} from '../modules/waypoint/matching/algorithms/polylineSimilarity.js';

describe('Polyline & Trajectory Similarity Algorithms', () => {
  const origin = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  const destination = { lat: 37.3382, lng: -121.8863 }; // San Jose

  test('haversineDistanceMeters should calculate accurate distance', () => {
    const dist = haversineDistanceMeters(origin, destination);
    expect(dist).toBeGreaterThan(60000);
    expect(dist).toBeLessThan(75000);
  });

  test('haversineDistanceMeters should return 0 for identical points', () => {
    const dist = haversineDistanceMeters(origin, origin);
    expect(dist).toBe(0);
  });

  test('computeDirectionalCosineSimilarity should return ~1.0 for parallel trajectories', () => {
    const pickup = { lat: 37.75, lng: -122.40 };
    const dropoff = { lat: 37.35, lng: -121.90 };
    const cosSim = computeDirectionalCosineSimilarity(origin, destination, pickup, dropoff);

    expect(cosSim).toBeGreaterThan(0.9);
  });

  test('computeRouteSimilarityScore should yield high score for aligned route', () => {
    const pickup = { lat: 37.7700, lng: -122.4100 };
    const dropoff = { lat: 37.3400, lng: -121.8900 };
    const score = computeRouteSimilarityScore(origin, destination, pickup, dropoff);

    expect(score).toBeGreaterThan(0.8);
    expect(score).toBeLessThanOrEqual(1.0);
  });
});
