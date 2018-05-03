import { authorizeDeleteList } from '../../businessLogic';

export const deleteList = (
  root,
  { listId },
  { models: { User, List }, user },
) => authorizeDeleteList(user, listId, User, List);
