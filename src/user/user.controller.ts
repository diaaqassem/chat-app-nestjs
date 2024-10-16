import { Controller, Get, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get("/user-data")
    register() {
        return "This is user data";
    }

}
