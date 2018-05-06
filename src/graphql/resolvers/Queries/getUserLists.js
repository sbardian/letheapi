import { authorizeGetUserLists } from '../../businessLogic';

export const getUserLists = ({ id }, args, { models: { List } }) =>
  authorizeGetUserLists(id, args, List);
