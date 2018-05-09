import { returnUsers } from '../../../database/utils';
import { isAdmin } from '../checkAuth';

export const getUser = async (root, { userId }, { models: { User }, user }) => {
  if (user.isAdmin) {
    const userFound = await User.findById(userId);
    if (userFound) {
      return returnUsers(userFound);
    }
    return new Error(`User ID ${userId} not found`);
  }
  return new Error(
    'This is an Admin only function, please use getMyInfo query',
  );
};
