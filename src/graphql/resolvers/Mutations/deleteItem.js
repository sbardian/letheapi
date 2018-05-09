import { returnItems } from '../../../database/utils';
import { isAdmin, userOfListByItemId } from '../checkAuth';

export const deleteItem = async (
  root,
  { itemId },
  { models: { Item, User, List }, user },
) => {
  if (userOfListByItemId(user, itemId, User, List) || isAdmin(user)) {
    return returnItems(await Item.findByIdAndRemove(itemId));
  }
  return new Error('You do not have permission to delete this item');
};
