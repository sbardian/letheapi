import { returnUsers } from '../../../database/utils';

export const getListUsers = async ({ id }, args, { models: { User } }) =>
  (await User.find({ lists: id })).map(returnUsers);
