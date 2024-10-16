import { NestFactory } from '@nestjs/core';
import * as dotenv from "dotenv";
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("/api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // somewhere in your initialization file (google login)
  app.use(
    session({
      secret: 'diaa200',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60
      }
    }),
  );
  // Initialize passport and use the built-in `serializeUser` and `deserializeUser`.
  // We'll talk more about serialization and deserialization in a bit.
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 5000
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api`);
  });
}
bootstrap(); 