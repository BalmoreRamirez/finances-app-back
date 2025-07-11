import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  account_name: string;

  @IsInt()
  @IsNotEmpty()
  @MaxLength(10)
  balance: number;

  @IsInt()
  @IsNotEmpty()
  account_type_id: number;
}
