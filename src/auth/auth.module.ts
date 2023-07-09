import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get("JWT_SECRET_KEY"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
