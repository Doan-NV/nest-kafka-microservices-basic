import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  // @IsMatchPattern(PASSWORD_PATTERN)
  password: string;
}
