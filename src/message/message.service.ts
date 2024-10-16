import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto } from 'src/gateway/dtos/message.dto';
import { Rooms } from 'src/rooms/rooms.schema';
import { Message } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Rooms.name) private rooms: Model<Rooms>,
    @InjectModel(Message.name) private messages: Model<Message>,
  ) {}

  async addMessage(data: MessageDto) {
    const room = await this.rooms.findById(data.roomID).exec();
    if (!room) throw new BadRequestException({ message: 'Room not found' });
    if (!room.users.includes(data.userID)) {
      throw new BadRequestException({ message: "User isn't in the chat" });
    }
    console.log('message send');

    const newMessage = await this.messages.create({
      ...data,
      createdAt: new Date().toISOString(),
    });
    await newMessage.save();
    await this.rooms.updateOne(
      {
        _id: data.roomID,
      },
      { $push: { messages: newMessage._id } },
    );
    return newMessage;
  }

  getMessagesByRoomId(roomId: string): Promise<Message[]> {
    return this.messages.find({ roomId }).exec();
  }

  // async sendMessage(userID: string, roomID: string, text: string) {
  //     const message = await this.addMessage({ userID, roomID, text });
  //     this.rooms.updateOne({ _id: roomID }, { $push: { messages: message._id } }).exec();
  //     return message;
  // }
}
