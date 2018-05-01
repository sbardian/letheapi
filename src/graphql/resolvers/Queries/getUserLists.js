import { authorizeGetUserLists } from '../../businessLogic';

export const getUserLists = (user, args, context) =>
  authorizeGetUserLists(user, args, context);
