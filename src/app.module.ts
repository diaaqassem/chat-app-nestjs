import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { GatewayModule } from './gateway/gateway.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessageModule } from './message/message.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    AuthModule,
    PassportModule.register({ session: true }),
    GatewayModule,
    RoomsModule,
    MessageModule
  ],
})
export class AppModule {
  constructor() { }
}
