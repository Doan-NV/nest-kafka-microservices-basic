import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ErrorHelper } from 'src/helper/error';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.cookies.key) {
      ErrorHelper.UnauthorizedException('Unauthorized');
    }
    const user = await this.verifyToken(request.cookies.key);
    return user ? true : false;
  }

  async verifyToken(authorization: string) {
    const [bearer, token] = authorization.split(' ');
    if (bearer == 'Bearer' && token != '') {
      const user = await this.authService.verifyToken(token);

      if (!user) {
        ErrorHelper.UnauthorizedException('Unauthorized Exception');
      }
      return user;
    } else {
      ErrorHelper.UnauthorizedException('Unauthorized');
    }
  }
}
