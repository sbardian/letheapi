import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnUsers } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetUsers = async (user, username, User) =>
  (await User.find({ username })).map(returnUsers);
