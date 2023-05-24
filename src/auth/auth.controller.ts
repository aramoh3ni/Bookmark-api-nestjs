import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(): {
    message: string;
  } {
    return this.authService.login();
  }

  @Post("signin")
  signin(): {
    message: string;
  } {
    return this.authService.register();
  }
}
