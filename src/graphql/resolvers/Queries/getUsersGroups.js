import { authorizeGetUsersGroups } from '../../businessLogic';

export const getUsersGroups = (user, args, context) =>
  authorizeGetUsersGroups(user, args, context);
