import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
const bcrypt = require('bcryptjs');

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  name: string;
  @Prop({ unique: true, required: [true, 'Email must be provided'] })
  email: string;
  @Prop({ minlength: [8, 'Password should have at least 8 characters'] })
  password: string;
  @Prop({ required: true, trim: true })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});
