import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnItems } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeCreateItems = async (user, titles, Item) =>
  // TODO: implement user check.
  (await Item.create(titles)).map(returnItems);
