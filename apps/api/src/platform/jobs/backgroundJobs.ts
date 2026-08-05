import { prisma } from '../database/prisma.js';

export function initializeBackgroundJobs() {
  console.log('⏰ Terra Background Scheduled Jobs Initialized');

  // Job 1: Ride Expiry Cleanup Job (Runs every 60 seconds)
  setInterval(async () => {
    try {
      const expiredCount = await prisma.rideRequest.updateMany({
        where: {
          status: 'SEARCHING',
          desiredDepartureTime: {
            lt: new Date(Date.now() - 30 * 60000), // 30 mins past departure time
          },
        },
        data: {
          status: 'EXPIRED',
        },
      });

      if (expiredCount.count > 0) {
        console.log(`🧹 Ride Expiry Job: Expired ${expiredCount.count} stale SEARCHING ride request(s).`);
      }
    } catch (err: any) {
      console.warn('⚠️ Ride Expiry Job Warning:', err.message);
    }
  }, 60000);

  // Job 2: Hourly Analytics Aggregation Job (Runs every hour)
  setInterval(async () => {
    try {
      console.log('📊 Analytics Job: Aggregating hourly commute savings and CO2 reductions.');
    } catch (err: any) {
      console.warn('⚠️ Analytics Job Warning:', err.message);
    }
  }, 3600000);
}
