import { IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  price: number;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsInt()
  quantity: number;

  @IsString()
  category: string;
}
