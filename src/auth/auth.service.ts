import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
