import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorHelper } from 'src/helper/error';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}
  @Get()
  @UseGuards(AuthGuard)
  async getHello(@Req() request: Request): Promise<any> {
    return 'hello word';
  }

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
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<any> {
    const { token } = await this.authService.register(data);
    response.cookie('key', `Bearer ${token}`, { httpOnly: true });
    return { token };
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ): Promise<any> {
    await this.authService.logout(request.cookies.key);
    response.clearCookie('key', { httpOnly: true });
    return {
      message: 'success',
    };
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
}
