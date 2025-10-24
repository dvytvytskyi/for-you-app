import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string }> {
    const { email, phone, password, firstName, lastName, role, licenseNumber } = registerDto;

    // Перевірка чи існує користувач
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    // Валідація для BROKER
    if (role === UserRole.BROKER && !licenseNumber) {
      throw new BadRequestException('License number is required for BROKER role');
    }

    // Хешуємо пароль
    const passwordHash = await this.hashPassword(password);

    // Створюємо користувача
    const user = this.userRepository.create({
      email,
      phone,
      passwordHash,
      firstName,
      lastName,
      role,
      licenseNumber,
      status: role === UserRole.CLIENT ? UserStatus.ACTIVE : UserStatus.PENDING, // CLIENT - одразу ACTIVE, інші - PENDING
    });

    await this.userRepository.save(user);

    // Генеруємо JWT токен
    const accessToken = this.generateToken(user);

    // Не повертаємо passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, accessToken };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string }> {
    const { emailOrPhone, password } = loginDto;

    // Шукаємо користувача по email або phone
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Перевіряємо статус
    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Your account has been blocked');
    }

    if (user.status === UserStatus.REJECTED) {
      throw new UnauthorizedException('Your registration has been rejected');
    }

    // Перевіряємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Генеруємо JWT токен
    const accessToken = this.generateToken(user);

    // Не повертаємо passwordHash
    const { passwordHash: _pwd, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, accessToken };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }

    const { passwordHash: _hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}

