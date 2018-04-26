import { authorizeCreateItems } from '../../businessLogic';

export const createNewItems = (root, { titles }, { models: { Item }, user }) =>
  authorizeCreateItems(user, titles, Item);
