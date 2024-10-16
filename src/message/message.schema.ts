import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date } from "mongoose";
import { User } from "src/user/user.schema";
const bcrypt = require("bcryptjs")

@Schema()
export class Message {
    @Prop({ required: true, trim: true })
    content: string;
    @Prop({ type: mongoose.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ default: Date.now, required: true })
    createdAt: Date;
}


export const MessageSchema = SchemaFactory.createForClass(Message);
