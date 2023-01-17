import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('user')
  async user(@Req() request: Request) {
    const user = await this.userService.get(request.cookies.key);
    return user;
  }
}
