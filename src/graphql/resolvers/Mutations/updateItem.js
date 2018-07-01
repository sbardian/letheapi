import { userOfListByItemId } from '../checkAuth';
import { returnItems } from '../../../database/utils';
import { pubsub } from '../../../server/server';

export const updateItem = async (
  root,
  { itemId, title },
  { models: { Item, List, User }, user },
) => {
  if (userOfListByItemId(user, itemId, User, List) || user.isAdmin) {
    const editedItem = returnItems(
      await Item.findByIdAndUpdate(itemId, { title }, { new: true }),
    );
    pubsub.publish(`ITEM_EDITED`, {
      itemEdited: {
        ...editedItem,
        __typename: 'Item',
      },
    });
    return editedItem;
  }
  throw new Error('You do not have permission to update this item.');
};
