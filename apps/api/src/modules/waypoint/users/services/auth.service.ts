import { UserRepository } from '../repositories/user.repository.js';
import { RegisterUserDTO, LoginUserDTO } from '../dto/auth.dto.js';
import { hashPassword, verifyPassword } from '../../../../platform/auth/password.js';
import { AppError } from '../../../../platform/middleware/errorHandler.js';

export class AuthService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async register(dto: RegisterUserDTO) {
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new AppError(409, 'EMAIL_EXISTS', 'User with this email already exists');
    }

    const existingPhone = await this.userRepository.findByPhone(dto.phone);
    if (existingPhone) {
      throw new AppError(409, 'PHONE_EXISTS', 'User with this phone number already exists');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.userRepository.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const isValidPassword = await verifyPassword(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      driverProfile: (user as any).driverProfile || null,
      passengerProfile: (user as any).passengerProfile || null,
    };
  }
}
