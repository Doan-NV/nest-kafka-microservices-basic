import { IsEmail, IsString, MinLength, minLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class RegisterDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  // @IsMatchPattern(PASSWORD_PATTERN)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
