import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnGroups } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetUsersGroups = async (
  { username },
  args,
  { models: { Group } },
) =>
  (await Group.find({})
    .where('owner')
    .equals(username)).map(returnGroups);
