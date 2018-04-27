import { authorizeGetGroups } from '../../businessLogic';

export const getGroups = (
  root,
  { username, limit },
  { models: { Group, User } },
  user,
) => authorizeGetGroups(user, username, limit, Group, User);
