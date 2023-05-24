import { Injectable } from "@nestjs/common";
@Injectable()
export class AuthService {
  login(): { message: string } {
    return {
      message: "I am Successfully Logged in",
    };
  }
  register(): { message: string } {
    return {
      message: "Your account has been registered",
    };
  }
}
