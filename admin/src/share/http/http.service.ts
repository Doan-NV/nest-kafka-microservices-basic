import { Injectable } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ErrorHelper } from 'src/helper/error';
@Injectable()
export class HttpService {
  constructor(private httpService: NestHttpService) {}
  async get(url: string, token = '') {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Cookie: `key=${token}`,
          },
        }),
      );
      return data;
    } catch (error) {
      console.log(error.message);
      ErrorHelper.DynamicHttpException('error call api', 300);
    }
  }

  async post(body = {}, url: string, token = '') {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: {
            Cookie: `key=${token}`,
          },
        }),
      );
      return data;
    } catch (error) {
      ErrorHelper.DynamicHttpException(error?.response?.data?.message, 400);
    }
  }
}
