import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnLists } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetLists = async (
  user,
  userId,
  limit,
  title_contains,
  List,
  User,
) => {
  // TODO: implement user check.
  // (await Item.find({username: user}).limit(limit)).map(returnItems);
  return (await List.find({
    owner: userId,
    ...(title_contains && {
      title: { $regex: `${title_contains}`, $options: 'i' },
    }),
  }).limit(limit)).map(returnLists);
};
