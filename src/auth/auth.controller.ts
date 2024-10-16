import { BadRequestException, Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dtos/register-dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("/register")
    register(@Body() data: RegisterDto) {
        this.authService.createAccount({ ...data, provider: "local" })
            .then(() => {
                return { message: 'Registered Successfully' }
            }).catch((err) => {
                throw new BadRequestException("error is : ", err);
            })
    }

    //login with google
    @Get('/google')
    @UseGuards(GoogleAuthGuard)
    googleLogin() {
        return { message: 'Registered Successfully' }
    }

    //redirect after login
    @Get('/google/redirect')
    @UseGuards(GoogleAuthGuard)
    googleRedirect(@Req() req) {
        // return { message: 'Registered ' }
        return req.user;
    }

    // local login
    @Post('/logIn')
    @UseGuards(LocalAuthGuard)
    localLogin(@Req() req) {
        // const { email, password } = body;
        // if (!email || !password) {
        //     throw new BadRequestException('Email and Password are required');
        // } else {
        //     return this.authService.validateUser(email, password).then(user => {
        //         delete user['salt'];
        //         delete user['hash'];
        //         return user;
        //     });
        // }
        return req.user;
    }
}
