import { authorizeGetListItems } from '../../businessLogic';

export const getListItems = (list, { limit = 500 }, { models: { Item } }) =>
  authorizeGetListItems(list, limit, Item);
