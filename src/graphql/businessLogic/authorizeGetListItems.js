import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnItems } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetListItems = async ({ id }, limit, Item) =>
  // TODO: implement user check.
  // (await Item.find({username: user}).limit(limit)).map(returnItems);
  (await Item.find({})
    .where('list')
    .equals(id)
    .limit(limit)).map(returnItems);