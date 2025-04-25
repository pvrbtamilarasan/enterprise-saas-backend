import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(tenantId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { tenantId, isActive: true },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.isActive = :isActive', { isActive: true });
    
    if (includePassword) {
      queryBuilder.addSelect('user.password');
    }
    
    return queryBuilder.getOne();
  }

  async create(userData: Partial<User>): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.findByEmail(userData.email || '');
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    // Hash the password
    let hashedPassword: string;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    } else {
      throw new Error('Password is required');
    }
    
    // Create the user
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    
    const savedUser = await this.usersRepository.save(user);
    
    // Create a new object without the password
    const { password, ...result } = savedUser;
    return result as User;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    // If password is being updated, hash it
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }
    
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      lastLogin: new Date(),
    });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.update(id, { isActive: false });
    return result.affected ? result.affected > 0 : false;
  }
}