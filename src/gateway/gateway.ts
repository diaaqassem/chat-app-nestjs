import { Body, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomDto } from './dtos/rooms.dto';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { JoinRoomDto } from './dtos/join-room.dto';
import { instrument } from '@socket.io/admin-ui';
import { MessageDto } from './dtos/message.dto';
import { MessageService } from 'src/message/message.service';

//تم استدعاء هذا الملف في gateway module عشان يشتغل السرفر
@WebSocketGateway(5001, {
  cors: {
    origin: 'https://admin.socket.io',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateWay
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private roomService: RoomsService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  //create room
  // private readonly rooms: RoomDto[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    // console.log('Client connected', client);
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client);
    console.log('Client disconnected', client.id);
  }

  onModuleInit() {
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
  }

  @SubscribeMessage('create room')
  async createRoom(client: Socket, data: CreateRoomDto) {
    // console.log("data message : ", data);
    // console.log("data id : ", data.id);
    if (!data.id || !mongoose.isValidObjectId(data.id) || !data.name) {
      return this.server.to(client.id).emit('invalid', {
        err: 'Invalid user Id ,name',
      });
    }

    try {
      const room = await this.roomService.addRoom({
        name: data.name,
        user: data.id,
      });
      this.server.to(client.id).emit('joined room', `room_${room}`);

      this.server.to(client.id).socketsJoin(room._id.toString());
      // console.log(room._id.toString());
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @SubscribeMessage('join-room')
  async joinRoom(client: Socket, data: JoinRoomDto) {
    if (
      !data.userID ||
      !mongoose.isValidObjectId(data.userID) ||
      !data.roomID ||
      !mongoose.isValidObjectId(data.roomID)
    ) {
      return this.server.to(client.id).emit('invalid', {
        err: 'Invalid user ID & room ID',
      });
    }

    try {
      await this.roomService.joinRoom(data.userID, data.roomID);
      this.server.to(data.roomID.toString()).emit('receive-message', {
        message: `${data.userID} has joined the room`,
        userID: data.userID,
        roomID: data.roomID,
      });
      this.server.to(client.id).socketsJoin(data.roomID.toString());
    } catch (error) {
      return this.server
        .to(client.id)
        .emit('joined_failed', { message: 'Could not join' });
    }
    // let usersInTheSameRoom = await this.roomService.findUsersInARoom(data.roomID);
    // this.server.to(client.id).emit("joined", { users: usersInTheSameRoom })
  }

  //send message

  @SubscribeMessage('send-message')
  async sendMessage(client: Socket, data: MessageDto) {
    if (
      !data.content ||
      !data.roomID ||
      !data.userID ||
      !mongoose.isValidObjectId(data.userID) ||
      !mongoose.isValidObjectId(data.roomID)
    ) {
      return this.server.to(client.id).emit('invalid', {
        err: 'Invalid user ID , room ID & content !',
      });
    }

    try {
      const result = await this.messageService.addMessage(data);
      const roomData = await this.roomService.getRoomData(data.roomID);
      this.server.to(data.roomID.toString()).emit('receive-message', {
        message: `arrived message : ${result}`,
        roomData,
        userID: data.userID,
        roomID: data.roomID,
      });

      console.log(roomData);
      console.log('result: ', result);
    } catch (error) {
      console.log(error);
      return this.server
        .to(client.id)
        .emit('joined_failed', { message: 'Could not join' });
    }
  }
}
