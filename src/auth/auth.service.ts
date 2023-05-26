import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const { email, password } = dto;
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    // throw an exception if the user does not exist
    if (!user) throw new ForbiddenException("Invalid Credential");

    // compare the password against
    const isMatch = await argon.verify(user.hash, password);
    // throw an error if password does not match
    if (!isMatch) throw new ForbiddenException("Invalid Credential");

    return this.signToken(user.id, user.email);
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
          // firstName: dto.firstName,
          // lastName: dto.lastName,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error.code === "P2002")
        throw new ForbiddenException("Credentials taken");

      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };

    const secret = this.config.get("JWT_SECRET_KEY");

    const token = await this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret,
    });

    return { access_token: token };
  }
}
