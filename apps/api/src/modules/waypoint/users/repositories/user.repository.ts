import { prisma } from '../../../../platform/database/prisma.js';
import { User, UserRole } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { phone },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        driverProfile: true,
        passengerProfile: true,
      },
    });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
  }): Promise<User> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: data.role,
          status: 'ACTIVE',
        },
      });

      if (data.role === 'PASSENGER') {
        await tx.passengerProfile.create({
          data: {
            userId: user.id,
          },
        });
      }

      return user;
    });
  }
}
