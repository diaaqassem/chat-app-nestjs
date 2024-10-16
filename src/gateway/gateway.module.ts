import { Module } from '@nestjs/common';
import { ChatGateWay } from './gateway';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MessageModule } from 'src/message/message.module';

@Module({
    imports: [RoomsModule, MessageModule],
    controllers: [],
    providers: [ChatGateWay],
    // exports: [ChatGateWay] 
})
export class GatewayModule { }
