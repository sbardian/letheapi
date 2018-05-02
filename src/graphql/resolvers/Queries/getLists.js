import { authorizeGetLists } from '../../businessLogic';

export const getLists = (
  root,
  { userId, limit, title_contains },
  { models: { List, User }, user },
) => authorizeGetLists(user, userId, limit, title_contains, List, User);
