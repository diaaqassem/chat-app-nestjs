import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { RegisterDto } from './dtos/register-dto';
import { GoogleDto } from './dtos/google-dto';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private User: Model<User>) { }

    async createAccount(data: RegisterDto): Promise<User> {
        const userCreated = await new this.User(data);
        return await userCreated.save();
    }

    async googleLogin(data: GoogleDto): Promise<User> {
        const { email } = data;
        let user = await this.User.findOne({ email });

        if (!user) {
            const userCreated = new this.User({ ...data, provider: "google" });
            return await userCreated.save();
        }

        return user;
    }

    async findUser(id: mongoose.Types.ObjectId) {
        return await this.User.findById(id);
    }

    async validateLoginData(email: string, password: string) {
        const user = await this.User.findOne({ email });

        if (!user) throw new ForbiddenException('Email or password incorrect');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new ForbiddenException('Email or password incorrect')

        return user;
    }
}
