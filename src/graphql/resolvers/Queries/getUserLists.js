import { returnLists } from '../../../database/utils';

export const getUserLists = async ({ id }, args, { models: { List } }) =>
  (await List.find({ users: id })).map(returnLists);
