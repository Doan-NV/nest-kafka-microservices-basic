import { Injectable } from '@nestjs/common';
import { HttpService } from 'src/share/http/http.service';

@Injectable()
export class UserService {
  // baseURL = process.env.USERS_MS;
  constructor(private httpService: HttpService) {}

  async post(url: string, data: any, cookie = '') {
    return this.httpService.post(url, data);
  }
  // async put(url: string, data: any, cookie = '') {
  //   return this.httpService('put', url, data, cookie);
  // }

  async get(token: string) {
    const data = await this.httpService.get(token);
    return data;
  }
}
