import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnLists } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeCreateList = async (user, { title }, List, User) => {
  // TODO implement user check?
  const newList = await List.create({
    title,
    owner: user.id,
    users: [user.id],
    items: [],
  });
  const userfound = await User.findById(user.id);
  const { lists } = userfound;
  const { id } = newList;
  await User.update({ _id: user.id }, { $set: { lists: [...lists, id] } });
  return returnLists(newList);
};
