import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtGuard } from "src/auth/guard";
// import { User } from "@prisma/client";

@Controller("users")
export class UserController {
  @UseGuards(JwtGuard)
  @Get("me")
  getMe(@Req() req: Request): string {
    console.log(req.user);
    return "my user";
  }
}
