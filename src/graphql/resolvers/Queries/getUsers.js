import { returnUsers } from '../../../database/utils';
import { isAdmin } from '../checkAuth';

export const getUsers = async (
  root,
  args,
  { models: { User }, user, isAdmin },
) => {
  if (isAdmin(user)) {
    return (await User.find({})).map(returnUsers);
  }
  return new Error(
    'This is an Admin only function, please use getMyInfo query',
  );
};
