import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  account_name: string;

  @IsInt()
  @IsNotEmpty()
  balance: number;

  @IsInt()
  @IsNotEmpty()
  account_type_id: number;
}
