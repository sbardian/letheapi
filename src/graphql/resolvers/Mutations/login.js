import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';

export const login = async (
  root,
  { loginInput: { username, password } },
  { models: { User } },
) => {
  const u = await User.findOne({ username });
  if (u && (await bcrypt.compare(password, u.password))) {
    const token = jwt.sign(
      {
        id: u.id,
        email: u.email,
        username: u.username,
        isAdmin: u.isAdmin,
      },
      config.sessionSecret,
    );
    return { token };
  }
  return new Error('Bad username or password');
};
