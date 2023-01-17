import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { AuthGuard } from './auth.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  @UseGuards(AuthGuard)
  async user(@Req() request: Request) {
    const user = await this.userService.get(request.cookies.key);
    return user;
  }

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { token } = await this.userService.login(data);

    response.cookie('key', `Bearer ${token}`, { httpOnly: true });
    return { token };
  }

  @Post('/register')
  async register(
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { token } = await this.userService.register(data);
    response.cookie('key', `Bearer ${token}`, { httpOnly: true });
    return { token };
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<any> {
    await this.userService.logout(request.cookies.key);
    response.clearCookie('key', { httpOnly: true });
    return {
      message: 'success',
    };
  }
}
