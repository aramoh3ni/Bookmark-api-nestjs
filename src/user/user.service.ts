import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDTO } from "./dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: string, dto: EditUserDTO) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.password;

    return user;
  }
}
