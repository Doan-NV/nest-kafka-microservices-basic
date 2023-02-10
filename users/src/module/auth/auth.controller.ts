import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BcryptHelper } from 'src/helper/bcrypt';
import { ErrorHelper } from 'src/helper/error';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterUserDto, VerifyEmailDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}
  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<any> {
    const { token } = await this.authService.login(data);
    response.cookie('key', `Bearer ${token}`, { httpOnly: true });
    return { token };
  }

  @Post('/register')
  async register(
    @Body() data: RegisterUserDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<any> {
    try {
      const { token } = await this.authService.register(data);
      response.cookie('key', `Bearer ${token}`, { httpOnly: true });
      return { token };
    } catch (error) {
      ErrorHelper.BadGatewayException(error);
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ): Promise<any> {
    try {
      await this.authService.logout(request.cookies.key);
      response.clearCookie('key', { httpOnly: true });
      return {
        message: 'success',
      };
    } catch (error) {
      ErrorHelper.BadGatewayException(error);
    }
  }

  @Get('/verify-token')
  @UseGuards(AuthGuard)
  async user(@Req() request: Request) {
    const authorization = request.cookies['key'];
    const [bearer, token] = authorization.split(' ');
    if (bearer == 'Bearer' && token != '') {
      const user = await this.authService.verifyToken(token);

      if (!user) {
        ErrorHelper.UnauthorizedException('Unauthorized Exception');
      }
      return this.userService.findOneBy({ id: user.id });
    } else {
      ErrorHelper.UnauthorizedException('Unauthorized');
    }
  }

  @UseGuards(AuthGuard)
  @Put('auth/password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('passwordConfirm') passwordConfirm: string
  ) {
    if (password !== passwordConfirm) {
      ErrorHelper.UnauthorizedException('Unauthorized Exception');
    }

    const cookie = request.cookies.key;
    const [bearer, token] = cookie.split(' ');
    const { id } = await this.authService.verifyToken(token);

    await this.userService.update(id, {
      password: await BcryptHelper.hash(password),
    });

    return this.userService.findOneBy({ id });
  }

  @Get('/info')
  @UseGuards(AuthGuard)
  async getInfo(@Req() request: Request) {
    try {
      const authorization = request.cookies['key'];

      const [bearer, token] = authorization.split(' ');
      if (bearer == 'Bearer' && token != '') {
        const user = await this.authService.verifyToken(token);

        if (!user) {
          ErrorHelper.UnauthorizedException('Unauthorized Exception');
        }
        return this.userService.findOneBy({ id: user.id });
      } else {
        ErrorHelper.UnauthorizedException('Unauthorized');
      }
    } catch (error) {
      ErrorHelper.BadGatewayException(error);
    }
  }

  @Post('/verify-email')
  async create(@Body() body: VerifyEmailDto): Promise<any> {
    try {
      const data = await this.authService.sendVerifyEmail(body);
      return data;
    } catch (error) {
      console.log(error);
      ErrorHelper.BadRequestException(error);
    }
  }
}
