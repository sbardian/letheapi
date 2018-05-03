import { authorizeGetLists } from '../../businessLogic';

export const getLists = (
  root,
  { userId, limit, contains_title, id_is },
  { models: { List, User }, user },
) => authorizeGetLists(user, userId, limit, contains_title, id_is, List, User);
