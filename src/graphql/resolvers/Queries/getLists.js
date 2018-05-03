import { authorizeGetLists } from '../../businessLogic';

export const getLists = (
  root,
  { userId, limit, contains_title },
  { models: { List, User }, user },
) => authorizeGetLists(user, userId, limit, contains_title, List, User);
