import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    provider?: string;
}