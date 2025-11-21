import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  private readonly jwtExpiresIn = '24h';

  constructor(private readonly userRepository: UserRepository) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
    });

    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );
  }
}

