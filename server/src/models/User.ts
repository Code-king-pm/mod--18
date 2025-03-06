import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: any[];
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  savedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
});

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Custom method to compare and validate password
userSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = model<UserDocument>('User', userSchema);

export default User;