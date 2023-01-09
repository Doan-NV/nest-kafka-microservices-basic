import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getHello(): Promise<any> {
    const data = await this.usersService.create({
      firstName: 'doan',
      lastName: 'nguyen van',
      email: 'doannv@meeyland.com',
      password: '123456',
      isAmbassador: true,
    });
    // const data = await this.usersService.findAll();
    return data;
  }
}
