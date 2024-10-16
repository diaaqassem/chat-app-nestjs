import { Inject } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";

export class SessionSerializer extends PassportSerializer {
    constructor(@Inject(AuthService) private authService: AuthService) {
        super();
    }
    serializeUser(user: any, done: (err: Error, user?: any) => void): void {
        // Serialize the user by getting its id and password (for secure storage)
        console.log("Serializing User");
        done(null, user.id);
    }

    deserializeUser(user: any, done: (err: Error, user?: any) => void): void {
        // Deserialize the user by retrieving it from the database using the id
        console.log(`Deserializing User with ID ${user._id}`);
        this.authService.findUser(user._id).then((user) => {
            if (!user) { return done(new Error('No such user found')); }
            else { return done(null, user) };
        }).catch((error) => done(error));
    }

}
