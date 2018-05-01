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
  const { lists } = await User.find({ id: user.id });
  console.log('User creating List, Lists: ', lists);
  const { id } = newList;
  console.log('New list id = ', id);
  User.update({ id: user.id }, { $set: { lists: [{ ...lists, id: id }] } });
  return returnLists(newList);
};
