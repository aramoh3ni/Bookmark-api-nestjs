import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsAlpha,
  MaxLength,
  MinLength,
  Matches,
  Validate,
} from "class-validator";

export class SignUpDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @MinLength(4)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|\W).*$/, {
    message:
      "Password should contain at least one uppercase letter, one lowercase letter, and one number or special character",
  })
  password: string;

  @IsString()
  @MinLength(4)
  @Validate(PasswordMatch, ["password"])
  passwordConfirm: string;

  @IsString()
  @IsOptional()
  @IsAlpha()
  @MaxLength(100)
  @MinLength(2)
  firstName?: string;

  @IsString()
  @IsOptional()
  @IsAlpha()
  @MaxLength(100)
  @MinLength(2)
  lastName?: string;
}
function PasswordMatch(property: string) {
  return function (object, propertyName: string) {
    const password = object[property];
    const confirmPassword = object[propertyName];

    if (password !== confirmPassword) {
      const message = `${propertyName} and ${property} do not match`;
      throw new Error(message);
    }
  };
}
