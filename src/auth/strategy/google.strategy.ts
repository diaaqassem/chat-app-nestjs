import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
import { Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';

dotenv.config();
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.APP_URL}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('access token : ', accessToken);
    console.log('refresh Token : ', refreshToken);
    console.log('profile :', profile);

    const email = profile.emails[0].value;
    const name = profile.displayName;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const imageUrl = profile.photos?.[0]?.value || '';
    const user = await this.authService.googleLogin({ name, email });
    return user;

    // const { name, emails, photos } = profile;
    // return {
    //   email: emails[0].value,
    //   fullName: name,
    //   imageUrl: photos?.[0]?.value || ''
    // };
  }
}
