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

  async logout(token: string) {
    const url = `${BASE_URL}/auth/logout`;
    const response = await this.httpService.post({}, url, token);

    return response;
  }

  async get(token: string) {
    const url = `${BASE_URL}/auth/info`;
    const data = await this.httpService.get(url, token);
    return data;
  }
}
