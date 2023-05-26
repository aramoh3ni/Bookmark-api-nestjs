import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
// import { User } from "@prisma/client";

@Controller("users")
export class UserController {
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Req() req: Request): string {
    console.log(req.user);
    return "my user";
  }
}
