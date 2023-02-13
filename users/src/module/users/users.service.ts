import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BcryptHelper } from 'src/helper/bcrypt';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';

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
      return newUser;
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

  public async update(id: string, data = {}) {
    try {
      return await this.usersRepository.update(id, data);
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
