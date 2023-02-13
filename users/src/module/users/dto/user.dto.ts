import {
  IsString,
  IsEmail,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
}

export class UserTokenDto {
  userId: string;
  token: string;
  expiredAt: Date;
  createdAt?: Date;
}
