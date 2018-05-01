import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnLists } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetLists = async (user, userId, limit, List, User) =>
  // TODO: implement user check.
  // (await Item.find({username: user}).limit(limit)).map(returnItems);
  (await List.find({ owner: userId }).limit(limit)).map(returnLists);
