import { authorizeCreateGroups } from '../../businessLogic';

export const createNewGroups = (
  root,
  { groups },
  { models: { Group, User } },
  user,
) => authorizeCreateGroups(user, groups, Group, User);
