import { IsNotEmpty, IsString } from 'class-validator';
import  mongoose  from 'mongoose';

export class JoinRoomDto {
    
    @IsNotEmpty({ message: 'id is required' })
    userID: mongoose.Types.ObjectId;
    
    @IsNotEmpty({ message: 'id is required' })
    roomID: mongoose.Types.ObjectId;

    
}