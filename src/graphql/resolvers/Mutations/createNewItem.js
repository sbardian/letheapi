import { authorizeCreateItem } from '../../businessLogic';

export const createNewItem = (
  root,
  { ItemInfo },
  { models: { Item, User }, user },
) => authorizeCreateItem(user, ItemInfo, Item, User);
