import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnLists } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetUserLists = async (
  { id },
  args,
  { models: { List } },
) =>
  (await List.find({})
    .where('owner')
    .equals(id)).map(returnLists);
