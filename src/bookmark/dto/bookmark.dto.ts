import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class BookmarkDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;
}
