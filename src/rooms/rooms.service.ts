import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rooms } from './rooms.schema';
import mongoose, { Model } from 'mongoose';
import { RoomDto } from './dtos/room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Rooms.name) private rooms: Model<Rooms>) {}

  async addRoom(data: RoomDto): Promise<Rooms> {
    const createRoom = await this.rooms.create({
      name: data.name,
      users: [data.user],
      messages:[]
    });
    return await createRoom.save();
  }

  async findRoom(id: mongoose.Types.ObjectId): Promise<Rooms> {
    return await this.rooms.findById({ _id: id });
  }

  async joinRoom(
    userID: mongoose.Types.ObjectId,
    roomID: mongoose.Types.ObjectId,
  ) {
    //check on room
    let room = this.findRoom(roomID);
    if (!room) throw new NotFoundException('No such room');

    return await this.rooms.updateOne(
      { _id: roomID },
      { $push: { users: userID } },
    );
  }

  // findUsersInARoom

  // leaveRoom(userID: mongoose.Types.ObjectId, roomID: mongoose.Types.ObjectId) {
  //    let users = this.getRoomUsers(roomID);
  //    users = users.filter((value)=>{return value != userID})
  //    return this.updateUsersInRoom(roomID,users)

  // };

  removeUserFromRoom(userId: string, roomId: string) {
    return this.rooms
      .updateOne({ _id: roomId }, { $pull: { users: userId } })
      .exec();
  }

  async getRoomData(id: mongoose.Types.ObjectId) {
    let data = await this.rooms
      .findById(id)
      .populate('users')
      .populate('messages')
    return data;
  }
}
