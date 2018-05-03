import { userOfListByItemId } from './';
import { returnItems } from '../../database/utils';

export const authorizeDeleteItem = async (user, itemId, Item, User, List) => {
  if (userOfListByItemId(user, itemId, User, List)) {
    return returnItems(await Item.findByIdAndRemove(itemId));
  }
  return new Error('You do not have permission to delete this item');
};
