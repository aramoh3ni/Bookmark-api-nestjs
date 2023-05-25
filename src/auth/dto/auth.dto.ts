import { IsEmail, IsNotEmpty, IsString, IsAlpha } from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  lastName?: string;
}
