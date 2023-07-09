import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDTO, SignInDTO } from "./dto";
import * as argon from "argon2";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDTO) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hash,
        },
        select: {
          // temporary solution instead we will use transformer
          id: true,
          email: true,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error.code === "P2002") {
        throw new ForbiddenException("Credentials Taken");
      }

      throw error;
    }
  }

  async signin(dto: SignInDTO) {
    // TODO: find the user through email address
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) throw new ForbiddenException("Credential Error");

    // TODO: compare hashed and user saved password
    const IsPwdMatched = await argon.verify(user.password, dto.password);

    if (!IsPwdMatched) throw new ForbiddenException("Credential Error");
    // TODO: return user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    const jwtSecret = this.config.get("JWT_SECRET_KEY");

    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.sign(payload, {
      expiresIn: "15m",
      secret: jwtSecret,
      algorithm: "RS256",
    });

    return {
      accessToken: token,
    };
  }
}
