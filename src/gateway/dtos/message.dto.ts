import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class MessageDto {

    @IsNotEmpty({ message: 'id is required' })
    userID: mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty({ message: 'id is required' })
    roomID: mongoose.Types.ObjectId;


}