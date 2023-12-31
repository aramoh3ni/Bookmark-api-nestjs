import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // allow us to get only the necessary params from url
    }),
  ); // allow validation of requests
  await app.listen(8000, "0.0.0.0");
}
bootstrap();
