import { isAdmin } from './';
import { returnUsers } from '../../database/utils';

export const authorizeGetUser = async (user, userId, User) => {
  if (isAdmin(user)) {
    return returnUsers(await User.findById(userId));
  } else {
    return new Error(
      'This is an Admin only function, please use getMyInfo query',
    );
  }
};
