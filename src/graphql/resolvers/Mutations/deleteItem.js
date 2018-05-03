import { authorizeDeleteItem } from '../../businessLogic';

export const deleteItem = (
  root,
  { itemId },
  { models: { Item, User, List }, user },
) => authorizeDeleteItem(user, itemId, Item, User, List);
