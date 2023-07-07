import {
  IsAlpha,
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class EditUserDTO {
  @IsString()
  @IsAlpha()
  @IsOptional()
  @MaxLength(100)
  @MinLength(3)
  firstName?: string;

  @IsString()
  @IsAlpha()
  @IsOptional()
  @MaxLength(100)
  @MinLength(3)
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
