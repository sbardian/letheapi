import { authorizeGetItems } from '../../businessLogic';

export const getItems = (root, { limit = 500 }, { models: { Item } }, user) =>
  authorizeGetItems(user, limit, Item);
