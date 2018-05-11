import { returnUsers } from '../../../database/utils';

export const getUser = async (root, { userId }, { models: { User }, user }) => {
  if (!user.isAdmin) {
    throw new Error(
      'This is an Admin only function, please use getMyInfo query',
    );
  }
  const userFound = await User.findById(userId);
  if (!userFound) {
    throw new Error(`User ID ${userId} not found`);
  }
  return returnUsers(userFound);
};
