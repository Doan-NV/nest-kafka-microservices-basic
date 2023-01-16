import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ErrorHelper } from 'src/helper/error';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.cookies.key) {
      ErrorHelper.UnauthorizedException('Unauthorized');
    }
    const user = await this.userService.get(request.cookies.key);
    return user ? true : false;
    // return validateRequest(request);
  }
}
