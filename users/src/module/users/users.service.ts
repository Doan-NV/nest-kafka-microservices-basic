import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BcryptHelper } from 'src/helper/bcrypt';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOneBy(params: FindOptionsWhere<User>): Promise<User> {
    try {
      return this.usersRepository.findOneBy(params);
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
      password = await BcryptHelper.hasPassword(password);
      const newUser = await this.usersRepository.save({ ...user, password });
      return newUser.id;
    } catch (error) {
      throw error;
    }
  }
}
