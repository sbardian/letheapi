import { returnItems } from '../../../database/utils';
import { userOfListByItemId } from '../checkAuth';
import { pubsub } from '../../../server/server';

export const deleteItem = async (
  root,
  { itemId },
  { models: { Item, User, List }, user },
) => {
  if (userOfListByItemId(user, itemId, User, List) || user.isAdmin) {
    const deletedItem = returnItems(await Item.findByIdAndRemove(itemId));
    pubsub.publish(`ITEM_DELETED`, {
      itemDeleted: {
        ...deletedItem,
        __typename: 'Item',
      },
    });
    return deletedItem;
  }
  throw new Error('You do not have permission to delete this item.');
};
