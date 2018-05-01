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
  console.log('user found = ', userfound);
  const { lists } = userfound;
  console.log('User creating List, Lists: ', lists);
  const { id } = newList;
  console.log('New list id = ', id);
  await User.update({ _id: user.id }, { $set: { lists: [...lists, id] } });
  return returnLists(newList);
};
