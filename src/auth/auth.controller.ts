import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { SignUpDTO, SignInDTO } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  signup(@Body() dto: SignUpDTO) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(@Body() dto: SignInDTO) {
    return this.authService.signin(dto);
  }
}
