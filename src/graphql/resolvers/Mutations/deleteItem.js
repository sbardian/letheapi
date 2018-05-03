import { authorizeDeleteItem } from '../../businessLogic';

export const deleteItem = (root, { itemId }, { models: { Item }, user }) =>
  authorizeDeleteItem(user, itemId, Item);
