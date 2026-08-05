import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { CreateVehicleDTO } from '../dto/vehicle.dto.js';
import { AppError } from '../../../../platform/middleware/errorHandler.js';
import { prisma } from '../../../../platform/database/prisma.js';

export class VehicleService {
  constructor(
    private vehicleRepository: VehicleRepository = new VehicleRepository(),
    private userRepository: UserRepository = new UserRepository()
  ) {}

  async registerVehicle(userId: string, dto: CreateVehicleDTO) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    let driverProfile = (user as any).driverProfile;
    if (!driverProfile) {
      // Auto-create driver profile if user is registering a vehicle
      driverProfile = await prisma.driverProfile.create({
        data: {
          userId,
          licenseNumber: `LIC_${Date.now()}`,
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
          isVerified: true,
        },
      });
    }

    const existingPlate = await this.vehicleRepository.findByPlateNumber(dto.plateNumber);
    if (existingPlate) {
      throw new AppError(409, 'PLATE_EXISTS', 'Vehicle with this plate number is already registered');
    }

    return this.vehicleRepository.createVehicle(driverProfile.id, dto);
  }

  async getDriverVehicles(userId: string) {
    const user = await this.userRepository.findById(userId);
    const driverProfile = (user as any)?.driverProfile;
    if (!driverProfile) {
      return [];
    }

    return this.vehicleRepository.findByDriverId(driverProfile.id);
  }
}
