import { SpatialRideRepository } from '../repositories/spatialRide.repository.js';
import { UserRepository } from '../../users/repositories/user.repository.js';
import { CreateRideOfferDTO, CreateRideRequestDTO } from '../dto/ride.dto.js';
import { AppError } from '../../../../platform/middleware/errorHandler.js';
import { prisma } from '../../../../platform/database/prisma.js';

export class RideService {
  constructor(
    private spatialRideRepository: SpatialRideRepository = new SpatialRideRepository(),
    private userRepository: UserRepository = new UserRepository()
  ) {}

  async createRideOffer(userId: string, dto: CreateRideOfferDTO) {
    const user = await this.userRepository.findById(userId);
    const driverProfile = (user as any)?.driverProfile;

    if (!driverProfile) {
      throw new AppError(403, 'NOT_A_DRIVER', 'Driver profile required to publish a ride offer');
    }

    return this.spatialRideRepository.createRideOffer(driverProfile.id, dto);
  }

  async createRideRequest(userId: string, dto: CreateRideRequestDTO) {
    const user = await this.userRepository.findById(userId);
    let passengerProfile = (user as any)?.passengerProfile;

    if (!passengerProfile) {
      passengerProfile = await prisma.passengerProfile.create({
        data: { userId },
      });
    }

    return this.spatialRideRepository.createRideRequest(passengerProfile.id, dto);
  }

  async getOfferById(id: string) {
    const offer = await prisma.rideOffer.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarUrl: true, phone: true },
            },
          },
        },
        vehicle: true,
      },
    });

    if (!offer) {
      throw new AppError(404, 'OFFER_NOT_FOUND', 'Ride offer not found');
    }

    return offer;
  }

  async getRequestById(id: string) {
    const request = await prisma.rideRequest.findUnique({
      where: { id },
      include: {
        passenger: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarUrl: true, phone: true },
            },
          },
        },
      },
    });

    if (!request) {
      throw new AppError(404, 'REQUEST_NOT_FOUND', 'Ride request not found');
    }

    return request;
  }
}
