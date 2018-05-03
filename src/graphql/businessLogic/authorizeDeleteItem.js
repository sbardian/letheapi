import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnItems } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeDeleteItem = async (user, itemId, Item) =>
  // TODO: implement user check.
  returnItems(await Item.findByIdAndRemove(itemId));
