import { getOnlySelf } from './';
import { returnUsers } from '../../database/utils';

export const authorizeGetUser = async (user, userId, User) => {
  if (getOnlySelf(user, userId)) {
    return returnUsers(await User.findById(userId));
  } else {
    return new Error('You are only allowed to retrieve your own information');
  }
};
