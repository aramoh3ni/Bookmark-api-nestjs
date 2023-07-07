import { Controller, Get, Body, UseGuards, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";
import { User } from "@prisma/client";
import { EditUserDTO } from "./dto";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  getMyAccount(@GetUser() user: User) {
    return user;
  }

  @Put()
  updateUser(@GetUser("id") userId: string, @Body() dto: EditUserDTO) {
    return this.userService.updateUser(userId, dto);
  }
}
