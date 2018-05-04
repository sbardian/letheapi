import { returnUsers } from '../../database/utils';

export const authorizeGetMyInfo = async (user, User) =>
  returnUsers(await User.findById(user.id));
