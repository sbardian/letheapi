import { authorizeGetGroupsUsers } from '../../businessLogic';

export const getGroupsUsers = (group, args, context) =>
  authorizeGetGroupsUsers(group, args, context);
