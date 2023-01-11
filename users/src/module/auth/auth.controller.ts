import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  async getHello(): Promise<any> {
    return 'hello word';
  }

  @Post()
  async login(@Body() data: LoginDto): Promise<string> {
    console.log(data);
    // const {accessToken} = await this.authService.generateToken(data)
    return 'hello word';
  }
}
