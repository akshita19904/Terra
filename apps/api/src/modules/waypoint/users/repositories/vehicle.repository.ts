import { prisma } from '../../../../platform/database/prisma.js';
import { Vehicle } from '@prisma/client';
import { CreateVehicleDTO } from '../dto/vehicle.dto.js';

export class VehicleRepository {
  async createVehicle(driverId: string, dto: CreateVehicleDTO): Promise<Vehicle> {
    return prisma.vehicle.create({
      data: {
        driverId,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        color: dto.color,
        plateNumber: dto.plateNumber.toUpperCase(),
        totalCapacity: dto.totalCapacity,
        availableSeats: dto.totalCapacity,
        comfortClass: dto.comfortClass,
      },
    });
  }

  async findByDriverId(driverId: string): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: { driverId, isActive: true },
    });
  }

  async findByPlateNumber(plateNumber: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { plateNumber: plateNumber.toUpperCase() },
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }
}
