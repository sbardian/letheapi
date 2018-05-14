import { returnItems } from '../../../database/utils';
import { userOfListByItemId } from '../checkAuth';

export const deleteItem = async (
  root,
  { itemId },
  { models: { Item, User, List }, user },
) => {
  if (userOfListByItemId(user, itemId, User, List) || user.isAdmin) {
    return returnItems(await Item.findByIdAndRemove(itemId));
  }
  throw new Error('You do not have permission to delete this item.');
};
