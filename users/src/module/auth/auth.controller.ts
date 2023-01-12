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
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  @UseGuards(AuthGuard)
  async getHello(@Req() request: Request): Promise<any> {
    console.log(request.cookies);
    return 'hello word';
  }

  @Post()
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { token } = await this.authService.login(data);
    response.cookie('key', token);
    return { token };
  }

  @Post('/register')
  async register(
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { token } = await this.authService.register(data);
    response.cookie('key', token);
    return { token };
  }
}
