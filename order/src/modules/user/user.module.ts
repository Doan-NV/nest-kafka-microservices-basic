import { Module } from '@nestjs/common';
import { HttpModule } from 'src/share/http/http.module';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
