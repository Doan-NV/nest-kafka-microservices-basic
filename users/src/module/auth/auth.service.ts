import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EMAIL_TOPIC } from 'src/environments';
import { BcryptHelper } from 'src/helper/bcrypt';
import { ErrorHelper } from 'src/helper/error';
import { TokenHelper } from 'src/helper/token';
import { ConfigService } from 'src/share/config/config.service';
import { DataSource } from 'typeorm';
import { RedisService } from '../cache/redis.service';
import { KafkaService } from '../kafka/kafka.service';
import { UsersService } from '../users/users.service';
import { TokenService } from '../users/userToken.service';
import { LoginDto, RegisterUserDto, VerifyEmailDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private dataSource: DataSource,
    private kafkaService: KafkaService,
    @Inject('REDIS') private readonly redisService: RedisService
  ) {}
  async verifyToken(token: string): Promise<any> {
    try {
      const secret = this.configService.accessTokenSecret;
      const user = await TokenHelper.verifyToken(token, secret);
      if (user) {
        const tokenEx = await this.tokenService.findOneBy({
          userId: user.id,
          token: token,
        });

        if (!tokenEx || tokenEx.expiredAt === null) {
          ErrorHelper.UnauthorizedException('token expires!');
        }
        return user;
      }
    } catch (error) {
      throw error;
    }
  }
  async validateToken(authorization: string): Promise<any> {
    const [bearer, token] = authorization.split(' ');
  }

  async login(data: LoginDto): Promise<any> {
    const { email, password } = data;
    const user = await this.usersService.validateUser({ email });

    if (!user) {
      throw 'username or email does not exist';
    }
    const passwordCompare = await BcryptHelper.compare(password, user.password);

    if (passwordCompare) {
      const { token, expires } = this._generateToken(user.id);
      const date = new Date();

      const existingToken = await this.tokenService.findOneBy({
        userId: user.id,
      });
      if (!existingToken) {
        await this.tokenService.create({
          token,
          userId: user.id,
          createdAt: date,
          expiredAt: new Date(date.getTime() + expires),
        });
      } else {
        await this.tokenService.update(existingToken.id, {
          token,
          userId: user.id,
          createdAt: date,
          expiredAt: new Date(date.getTime() + expires),
        });
      }
      return { token };
    } else {
      throw new HttpException({ message: 'wrong password' }, HttpStatus.FOUND);
    }
  }

  async register(data: RegisterUserDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        email,
        password,
        passwordConfirm,
        firstName,
        lastName,
        emailCode,
        username,
      } = data;
      if (password !== passwordConfirm) {
        throw 'password and passwordConfirm not match';
      }
      const user = await this.usersService.findOneBy({ email });
      if (user) {
        throw 'email already use!';
      }
      const code = await this.redisService.getByKey(email);
      console.log('🚀 code', code);
      if (emailCode !== code) {
        throw 'Email code wrong!';
      }
      const { id } = await this.usersService.create({
        firstName,
        lastName,
        email,
        password,
        username,
      });

      const { token, expires } = this._generateToken(id);
      const date = new Date();
      await this.tokenService.create({
        token,
        userId: id,
        createdAt: date,
        expiredAt: new Date(date.getTime() + expires),
      });
      await queryRunner.commitTransaction();
      await this.redisService.removeByKey(email);

      return token;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async logout(authorization: string): Promise<any> {
    const [bearer, token] = authorization.split(' ');
    try {
      const tokenEx = await this.tokenService.findOneBy({
        token,
      });

      await this.tokenService.update(tokenEx.id, {
        ...tokenEx,
        expiredAt: null,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendVerifyEmail(data: VerifyEmailDto): Promise<any> {
    try {
      const user = await this.usersService.findOneBy({ email: data.email });
      if (user) {
        throw 'Email already used';
      }
      const code = await this.redisService.getByKey(data.email);

      if (code) {
        throw 'error send mail, time does not expiries';
      }
      const codeOTP = TokenHelper.generateOTP();
      await this.redisService.addByKey(data.email, codeOTP, '5m');

      await this.kafkaService.emit([EMAIL_TOPIC], 'sendVerifyEmail', {
        ...data,
        message: codeOTP,
      });
    } catch (error) {
      throw error;
    }
  }

  private _generateToken(id: string) {
    const payload = {
      id,
    };
    const secret = this.configService.accessTokenSecret;
    const expiresIn = this.configService.accessTokenExpires;

    const { token, expires } = TokenHelper.generateToken(
      payload,
      secret,
      expiresIn
    );

    return {
      token,
      expires,
    };
  }
}
