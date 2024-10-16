import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Message } from "src/message/message.schema";
import { User } from "src/user/user.schema";
const bcrypt = require("bcryptjs")

@Schema()
export class Rooms {

    @Prop({ required: true, trim: true })
    name: string;
    @Prop({ type: mongoose.Types.ObjectId, required: [true, 'ID must be provided'], ref: "User" })
    users: mongoose.Types.ObjectId[];
    @Prop({ type: mongoose.Types.ObjectId, ref: "Message", required: true })
    messages: mongoose.Types.ObjectId[];
    _id: any;
}


export const RoomsSchema = SchemaFactory.createForClass(Rooms);
