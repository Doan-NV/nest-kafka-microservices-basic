import { Module } from '@nestjs/common';
import { HttpModule } from 'src/share/http/http.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
