import { Injectable } from '@nestjs/common';
import { HttpService } from 'src/share/http/http.service';
import { RegisterDto } from './dto/user.dto';
import { LoginDto } from 'src/modules/auth/dto/auth.dto';
import { BASE_URL } from 'src/environments';

@Injectable()
export class UserService {
  // baseURL = process.env.USERS_MS;
  constructor(private httpService: HttpService) {}
  async login(data: LoginDto) {
    const url = `${BASE_URL}/auth/login`;
    const response = await this.httpService.post(data, url);

    return response;
  }
  async register(data: RegisterDto) {
    const url = `${BASE_URL}/auth/register`;
    const response = await this.httpService.post(data, url);
    return response;
  }

  async logout(data: any) {
    return true;
  }

  async get(token: string) {
    const data = await this.httpService.get(token);
    return data;
  }
}
