import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParams } from 'src/entities/query';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (isEmailExist) {
      return {
        code: 400,
        status: 'error',
        message: 'Email already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return {
      code: 201,
      status: 'success',
      message: 'User created successfully',
      data: user,
    };
  }

  findAll(query: QueryParams) {
    return this.userRepository.find();
  }

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new Error('User not found');
    }
    const status = bcrypt.compareSync(password, user.password);

    if (status) {
      return user;
    }
    return null;
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refresh_token = hashedRefreshToken;
    return this.userRepository.save(user);
  }

  async verifyRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const status = bcrypt.compareSync(refreshToken, user.refresh_token);

    if (user) {
      if (status) {
        return user;
      }
    }
  }
}
