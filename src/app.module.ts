// it looks like app or index.js or ts in React Application.
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaModule } from "./prisma/prisma.module";
import { BookmarkModule } from "./bookmark/bookmark.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    BookmarkModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
