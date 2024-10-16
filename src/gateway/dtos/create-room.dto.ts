import { IsNotEmpty, IsString } from 'class-validator';
import  mongoose  from 'mongoose';

export class CreateRoomDto {
    
    @IsNotEmpty({ message: 'id is required' })
    id: mongoose.Types.ObjectId;

    @IsString()
    content: string;

    @IsString()
    name: string;
}