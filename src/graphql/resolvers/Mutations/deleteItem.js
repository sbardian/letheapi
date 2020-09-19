import { AuthenticationError } from 'apollo-server';
import { returnItems } from '../../../database/utils';
import { userOfListByItemId, isTokenValid } from '../checkAuth';
import { ITEM_DELETED } from '../../events';

export const deleteItem = async (
  root,
  { itemId },
  { models: { Item, User, List, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if (userOfListByItemId(user, itemId, User, List) || user.isAdmin) {
    const deletedItem = returnItems(await Item.findByIdAndRemove(itemId));
    pubsub.publish(ITEM_DELETED, {
      itemDeleted: {
        ...deletedItem,
        __typename: 'Item',
      },
    });
    return deletedItem;
  }
  throw new Error('You do not have permission to delete this item.');
};
