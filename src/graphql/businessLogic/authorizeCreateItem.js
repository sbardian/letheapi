import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnItems } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeCreateItem = async (user, ItemInfo, Item) =>
  // TODO: implement user check.
  returnItems(await Item.create({ ...ItemInfo, creator: user.id }));