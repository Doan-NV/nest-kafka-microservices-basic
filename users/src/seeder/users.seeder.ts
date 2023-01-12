import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../module/users/users.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UsersService);

  const password = await bcrypt.hash('123456', 12);
  console.log('run');
  for (let i = 0; i < 10; i++) {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password,
      isAmbassador: true,
    };

    await userService.create(data);
  }

  process.exit();
})();
