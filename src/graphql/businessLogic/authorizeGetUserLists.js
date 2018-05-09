import { returnLists } from '../../database/utils';

export const authorizeGetUserLists = async (id, args, List) =>
  (await List.find({ users: id })).map(returnLists);
