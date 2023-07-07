import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class EditBookmarkDTO {
  @IsString()
  @IsOptional()
  @MinLength(4)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  link?: string;
}
