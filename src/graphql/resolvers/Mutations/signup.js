import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';

export const signup = async (
  root,
  { signupInput: { username, email, password } },
  { models: { User } },
) => {
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
  throw new Error('Email or username already exists');
};
