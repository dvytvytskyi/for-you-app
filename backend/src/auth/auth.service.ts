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
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityAction, ActivityEntity } from '../database/entities/activity-log.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly activityLogService: ActivityLogService,
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

    // Логуємо реєстрацію
    await this.activityLogService.log({
      userId: user.id,
      action: ActivityAction.REGISTER,
      entityType: ActivityEntity.USER,
      entityId: user.id,
      description: `User registered with role ${user.role}`,
    });

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

    // Логуємо login
    await this.activityLogService.log({
      userId: user.id,
      action: ActivityAction.LOGIN,
      entityType: ActivityEntity.SYSTEM,
      description: `User logged in`,
    });

    // Генеруємо JWT токен
    const accessToken = this.generateToken(user);

    // Не повертаємо passwordHash
    const { passwordHash: _pwd, ...userWithoutPassword } = user;

    // Явно перевіряємо, що роль включена в відповідь
    const userResponse = {
      ...userWithoutPassword,
      role: user.role, // Явно додаємо роль для гарантії
    } as User;

    // Логуємо для діагностики
    console.log('Login - User role:', user.role);
    console.log('Login - UserResponse role:', userResponse.role);
    console.log('Login - UserResponse:', JSON.stringify(userResponse, null, 2));

    return { user: userResponse, accessToken };
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

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Перевірка на унікальність email, якщо він змінюється
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Перевірка на унікальність phone, якщо він змінюється
    if (updateProfileDto.phone && updateProfileDto.phone !== user.phone) {
      const existingUser = await this.userRepository.findOne({
        where: { phone: updateProfileDto.phone },
      });

      if (existingUser) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    // Оновлюємо поля
    if (updateProfileDto.firstName !== undefined) {
      user.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      user.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.email !== undefined) {
      user.email = updateProfileDto.email;
    }
    if (updateProfileDto.phone !== undefined) {
      user.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.licenseNumber !== undefined) {
      user.licenseNumber = updateProfileDto.licenseNumber;
    }
    if (updateProfileDto.avatar !== undefined) {
      user.avatar = updateProfileDto.avatar;
    }

    await this.userRepository.save(user);

    // Логуємо оновлення профілю
    await this.activityLogService.log({
      userId: user.id,
      action: ActivityAction.USER_UPDATE,
      entityType: ActivityEntity.USER,
      entityId: user.id,
      description: `User profile updated`,
    });

    // Не повертаємо passwordHash
    const { passwordHash: _hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
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

