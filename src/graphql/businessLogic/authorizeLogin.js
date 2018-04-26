import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/config';

export const authorizeLogin = async (username, password, User) => {
  const u = await User.findOne({ username });
  if (await bcrypt.compare(password, u.password)) {
    const token = jwt.sign(
      {
        id: u.id,
        email: u.email,
      },
      JWT_SECRET,
    );
    return { token };
  }
  throw new Error('Bad username or password');
};
