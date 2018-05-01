import { authorizeCreateList } from '../../businessLogic';

export const createNewList = (
  root,
  { ListInfo },
  { models: { List, User }, user },
) => authorizeCreateList(user, ListInfo, List, User);
