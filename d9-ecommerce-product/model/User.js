import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/validators.js';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_REGEX, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
    match: [PASSWORD_REGEX, 'Invalid password']
  },
  bio: {
    type: String,
    maxLength: 500,
    trim: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, 
{
  timestamps: true,
});

userSchema.pre('save', async function () {
  if(!this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);
export default UserModel;