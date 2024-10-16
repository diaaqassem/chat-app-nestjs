import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class RoomDto {
    
    @IsString()
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsNotEmpty()
    user: mongoose.Types.ObjectId;

    @IsOptional()
    message?:mongoose.Types.ObjectId;

}