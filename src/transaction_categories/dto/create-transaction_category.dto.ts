import { IsString, Length } from 'class-validator';

export class CreateTransactionCategoryDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 10)
  type: string;
}
