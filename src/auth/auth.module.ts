import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { GoogleStrategy } from './strategy/google.strategy';
import { SessionSerializer } from 'src/utilities/SessionSerialisation';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionSerializer, LocalStrategy]
})
export class AuthModule { }
