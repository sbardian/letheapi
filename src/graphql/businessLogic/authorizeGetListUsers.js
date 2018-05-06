import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnUsers } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetListUsers = async (id, args, Users) =>
  (await User.find({ lists: id })).map(returnUsers);
