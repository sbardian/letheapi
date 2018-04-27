import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnGroups } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetGroups = async (user, username, limit, Group, User) =>
  // TODO: implement user check.
  // (await Item.find({username: user}).limit(limit)).map(returnItems);
  (await Group.find({ owner: username }).limit(limit)).map(returnGroups);
