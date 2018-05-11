import { returnUsers } from '../../../database/utils';

export const getMyInfo = async (root, args, { models: { User }, user }) =>
  returnUsers(await User.findById(user.id));
