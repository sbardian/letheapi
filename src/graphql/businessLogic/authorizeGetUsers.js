import { isAdmin } from './';
import { returnUsers } from '../../database/utils';

export const authorizeGetUsers = async (user, User) => {
  if (isAdmin(user)) {
    return (await User.find({})).map(returnUsers);
  }
  return new Error(
    'This is an Admin only function, please use getMyInfo query',
  );
};
