import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @IsOptional()
    provider?: string;
}