import { returnUsers } from '../../../database/utils';

export const getMyInfo = async (
  root,
  args,
  { models: { User }, user, isAdmin },
) => returnUsers(await User.findById(user.id));
