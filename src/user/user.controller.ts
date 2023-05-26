import { Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";

@UseGuards(JwtGuard) // to make all endpoint protected.
@Controller("users")
export class UserController {
  // @UseGuards(JwtGuard) // make only only endpoint protected.
  @Get("me")
  getMe(@GetUser() user: User): User {
    return user;
  }

  @Patch("me")
  editMe(@GetUser() user: User): User {
    return user;
  }
}
