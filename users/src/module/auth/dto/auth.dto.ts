import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @MaxLength(254)
  @IsNotEmpty()
  @IsString()
  emailCode: string;

  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;

  @IsString()
  @MaxLength(40)
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  lastName: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsEmail()
  @MaxLength(254)
  email: string;
}
