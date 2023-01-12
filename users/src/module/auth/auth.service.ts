import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptHelper } from 'src/helper/bcrypt';
import { TokenHelper } from 'src/helper/token';
import { ConfigService } from 'src/share/config/config.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  async verifyToken(token: string): Promise<string> {
    const secret = this.configService.accessTokenSecret;

    const user = await TokenHelper.verifyToken(token, secret);
    return user;
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
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const passwordCompare = BcryptHelper.comparePassword(password);
    if (passwordCompare) {
      const { token } = this._generateToken(user.id);
      return { token };
    }
    return 'wrong';
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
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const { id } = await this.usersService.create(data);
      const { token } = this._generateToken(id);
      return { token };
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
      expiresIn,
    );
    // const refreshToken = this._generateRefreshToken(id);

    return {
      token: `Bearer ${token}`,
      expires,
      // refreshToken,
    };
  }
}
