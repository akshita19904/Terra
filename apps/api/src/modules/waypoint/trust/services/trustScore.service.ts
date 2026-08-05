import { prisma } from '../../../../platform/database/prisma.js';

export interface TrustScoreInput {
  completionRate: number;     // Ratio 0.0 - 1.0
  averageRatingNorm: number;  // Ratio 0.0 - 1.0 (rating / 5.0)
  cancellationRate: number;   // Ratio 0.0 - 1.0
  isVerified: boolean;        // Binary 0.0 or 1.0
  punctualityPenalty: number; // Ratio 0.0 - 1.0 (late arrival ratio)
}

export class TrustScoreService {
  /**
   * Calculates structured multi-factor Trust Score T in [1.00, 5.00]
   * Formula: T = 5.0 * (0.35*Comp + 0.25*Rating + 0.20*(1-Cancel) + 0.10*Verify + 0.10*(1-Late))
   */
  static calculateTrustScore(input: TrustScoreInput): number {
    const compWeight = 0.35 * Math.min(1, Math.max(0, input.completionRate));
    const ratingWeight = 0.25 * Math.min(1, Math.max(0, input.averageRatingNorm));
    const cancelWeight = 0.20 * (1 - Math.min(1, Math.max(0, input.cancellationRate)));
    const verifyWeight = 0.10 * (input.isVerified ? 1.0 : 0.0);
    const punctualityWeight = 0.10 * (1 - Math.min(1, Math.max(0, input.punctualityPenalty)));

    const scoreFactor = compWeight + ratingWeight + cancelWeight + verifyWeight + punctualityWeight;
    const finalScore = Number((5.0 * scoreFactor).toFixed(2));

    // Clamp score to [1.00, 5.00]
    return Math.max(1.00, Math.min(5.00, finalScore));
  }

  async recalculateDriverTrust(driverId: string): Promise<number> {
    const driver = await prisma.driverProfile.findUnique({
      where: { id: driverId },
      include: { user: true },
    });

    if (!driver) return 5.00;

    const totalTrips = driver.totalTrips || 1;
    const cancelRate = Number(driver.cancellationRate || 0);

    const calculatedScore = TrustScoreService.calculateTrustScore({
      completionRate: Math.max(0.7, 1.0 - cancelRate),
      averageRatingNorm: Number(driver.trustScore) / 5.0,
      cancellationRate: cancelRate,
      isVerified: driver.isVerified,
      punctualityPenalty: 0.05,
    });

    await prisma.driverProfile.update({
      where: { id: driverId },
      data: { trustScore: calculatedScore },
    });

    return calculatedScore;
  }
}
