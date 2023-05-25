import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login(): { message: string } {
    return {
      message: "I am Successfully Logged in",
    };
  }

  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const ifUserExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (ifUserExists) throw new ForbiddenException("Credentials Taken");

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error.code === "P2002")
        throw new ForbiddenException("Credentials taken");

      throw error;
    }
  }
}
