import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnLists } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeCreateList = async (user, { title }, List, User) => {
  // TODO implement user check?
  return returnLists(
    await List.create({
      title,
      owner: user.id,
      users: [user],
      items: [],
    }),
  );
};
