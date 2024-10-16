import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoomDto {
  @IsString()
  @IsNotEmpty({ message: 'ID is required' })
  clientID: string;

  @IsNotEmpty()
  @IsString()
  userID: string;

  @IsString()
  content: string;

  @IsNumber()
  roomID: string;
}
