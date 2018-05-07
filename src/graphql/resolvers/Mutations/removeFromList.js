import { authorizeRemoveFromList } from '../../businessLogic';

export const removeFromList = (
  root,
  { listId, userId },
  { models: { User, List }, user },
) => authorizeRemoveFromList(user, listId, userId, User, List);
