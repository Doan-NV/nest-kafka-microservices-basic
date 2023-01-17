import { IsString } from 'class-validator';

export class ProductCreateDto {
  @IsString()
  title?: string;
  @IsString()
  description?: string;
  @IsString()
  image?: string;
  @IsString()
  price?: string;
}
