import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BcryptHelper } from 'src/helper/bcrypt';
import { UserDto, UserTokenDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserToken } from './entity/user.token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken)
    private tokenRepository: Repository<UserToken>
  ) {}

  async findAll(): Promise<UserToken[]> {
    try {
      return this.tokenRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOneBy(params: FindOptionsWhere<UserToken>): Promise<UserToken> {
    try {
      return this.tokenRepository.findOneBy(params);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.tokenRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  public async create(userToken: UserTokenDto): Promise<any> {
    try {
      const newUserToken = await this.tokenRepository.save(userToken);
      const s = await this.tokenRepository.find({
        relations: {},
      });

      return newUserToken;
    } catch (error) {
      throw error;
    }
  }
  public async update(id: string, data: UserTokenDto) {
    try {
      const newUserToken = await this.tokenRepository.update(id, data);
      const s = await this.tokenRepository.find({
        relations: {},
      });

      return newUserToken;
    } catch (error) {
      throw error;
    }
  }
}
