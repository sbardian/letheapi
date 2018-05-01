import { authorizeCreateItem } from '../../businessLogic';

export const createNewItem = (root, { ItemInfo }, { models: { Item }, user }) =>
  authorizeCreateItem(user, ItemInfo, Item);
