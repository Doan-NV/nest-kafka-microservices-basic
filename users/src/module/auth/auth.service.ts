import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EMAIL_TOPIC } from 'src/environments';
import { BcryptHelper } from 'src/helper/bcrypt';
import { ErrorHelper } from 'src/helper/error';
import { TokenHelper } from 'src/helper/token';
import { ConfigService } from 'src/share/config/config.service';
import { KafkaService } from '../kafka/kafka.service';
// import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { TokenService } from '../users/userToken.service';
import { LoginDto, RegisterUserDto, VerifyEmailDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private kafkaService: KafkaService,
    // private redisService: RedisService
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
      throw new HttpException(
        { message: 'username or email does not exist' },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
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
    try {
      const { email } = data;
      const existUser = await this.usersService.findOneBy({ email });
      if (existUser) {
        throw new HttpException(
          {
            message:
              'username or email exist, please login or register by other email',
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
      const { id } = await this.usersService.create(data);
      const { token } = this._generateToken(id);
      return { token };
    } catch (error) {
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
    // sinh ma code
    const code = TokenHelper.generateOTP();
    // luu user vao database

    // send email ma code
    await this.kafkaService.emit([EMAIL_TOPIC], 'sendVerifyEmail', {
      ...data,
      message: code,
    });
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
    // const refreshToken = this._generateRefreshToken(id);

    return {
      token,
      expires,
      // refreshToken,
    };
  }
}
