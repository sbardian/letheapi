import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/config';

export const authorizeSignup = async (username, email, password, User) => {
  if (!(await User.findOne({ email }))) {
    const passHash = await bcrypt.hash(password, 10);
    const { id } = await User.create({
      email,
      username,
      password: passHash,
    });
    const token = jwt.sign({ id, email }, JWT_SECRET);
    return { token };
  }
  return new Error('Email already exists');
};
