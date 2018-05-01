import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnUsers } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetUser = async (user, userId, User) =>
  returnUsers(await User.findById(userId));
