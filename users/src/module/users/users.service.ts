import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, FindOptionsWhere, Repository } from 'typeorm';
import { BcryptHelper } from 'src/helper/bcrypt';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOneBy(params: FindOptionsWhere<User>): Promise<User | any> {
    console.log('🚀 ~ file: users.service.ts:23 ~ UsersService ~ findOneBy ~ params', params);

    try {
      const user = await this.usersRepository.findOneBy(params);
      return user ? this.buildUser(user) : user;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  public async create(user: UserDto): Promise<any> {
    try {
      let { password } = user;
      password = await BcryptHelper.hash(password);
      const newUser = await this.usersRepository.save({ ...user, password });
      return newUser.id;
    } catch (error) {
      throw error;
    }
  }

  public async validateUser(params: FindOptionsWhere<User>) {
    try {
      const user = await this.usersRepository.findOneBy(params);
      return user;
    } catch (error) {
      throw error;
    }
  }

  private buildUser(user: User) {
    const data = {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
    };
    return data;
  }
}
