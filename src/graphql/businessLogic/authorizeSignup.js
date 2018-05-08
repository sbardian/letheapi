import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

// TODO: validate all the things.
export const authorizeSignup = async (username, email, password, User) => {
  if (!(await User.findOne({ $or: [{ email }, { username }] }))) {
    const passHash = await bcrypt.hash(password, 10);
    const { id } = await User.create({
      email,
      username,
      password: passHash,
    });
    const token = jwt.sign({ id, email }, config.sessionSecret);
    return { token };
  }
  return new Error('Email or username already exists');
};
