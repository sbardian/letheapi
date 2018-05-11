import { returnUsers } from '../../../database/utils';

export const getUsers = async (root, args, { models: { User }, user }) => {
  if (!user.isAdmin) {
    throw new Error(
      'This is an Admin only function, please use getMyInfo query',
    );
  }
  return (await User.find()).map(returnUsers);
};
