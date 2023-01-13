import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptHelper } from 'src/helper/bcrypt';
import { ErrorHelper } from 'src/helper/error';
import { TokenHelper } from 'src/helper/token';
import { ConfigService } from 'src/share/config/config.service';
import { UsersService } from '../users/users.service';
import { TokenService } from '../users/userToken.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService
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
  async validateUser(): Promise<any> {
    return 'validate user';
  }

  async login(data: LoginDto): Promise<any> {
    const { email, password } = data;
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new HttpException(
        { message: 'username or email does not exist' },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
    const passwordCompare = BcryptHelper.comparePassword(password);
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

  async register(data: RegisterDto): Promise<any> {
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
