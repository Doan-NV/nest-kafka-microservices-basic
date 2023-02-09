import {
  IsString,
  IsEmail,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UserDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAmbassador?: boolean;
}

export class UserTokenDto {
  userId: string;
  token: string;
  expiredAt: Date;
  createdAt?: Date;
}
