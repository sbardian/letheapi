import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  lists: [String],
  isAdmin: Boolean,
  profileImageUrl: String,
});

const User = mongoose.model('User', UserSchema);
export default User;
