import { IsString, IsEmail } from 'class-validator';

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
