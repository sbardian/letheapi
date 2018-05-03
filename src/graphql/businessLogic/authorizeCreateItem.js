import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userOfList } from './';
import { returnItems } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeCreateItem = async (user, ItemInfo, Item, User) => {
  if (userOfListByListId(user, ItemInfo.list, User)) {
    return returnItems(await Item.create({ ...ItemInfo, creator: user.id }));
  } else {
    return new Error('You do not have permission to create items in this list');
  }
};
