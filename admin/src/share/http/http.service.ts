import { Injectable } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ErrorHelper } from 'src/helper/error';
import { BASE_URL } from 'src/environments';
@Injectable()
export class HttpService {
  constructor(private httpService: NestHttpService) {}
  async get(authorization: string) {
    const [bearer, token] = authorization.split(' ');
    const urlLineApis = `${BASE_URL}/auth/verify-token`;
    try {
      console.log('token: ', token);

      const { data } = await firstValueFrom(
        this.httpService.get(urlLineApis, {
          headers: {
            Cookie: `key=Bearer ${token}`,
          },
        }),
      );
      return data;
    } catch (error) {
      console.log(error.message);
      ErrorHelper.DynamicHttpException('error call api', 300);
    }
  }

  async post(body: any, urlLineApis: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(urlLineApis, body),
      );
      return data;
    } catch (error) {
      console.log(error.response.data);
      ErrorHelper.DynamicHttpException(error.response.data.message, 400);
    }
  }
}
