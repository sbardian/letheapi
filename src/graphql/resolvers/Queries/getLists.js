import { authorizeGetLists } from '../../businessLogic';

export const getLists = (
  root,
  { userId, limit },
  { models: { List, User }, user },
) => authorizeGetLists(user, userId, limit, List, User);
