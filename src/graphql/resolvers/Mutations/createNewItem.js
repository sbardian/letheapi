import { returnItems } from '../../../database/utils';
import { userOfListByListId } from '../checkAuth';
import { pubsub } from '../../../server/server';

export const createNewItem = async (
  root,
  { ItemInfo },
  { models: { Item, User }, user },
) => {
  if (userOfListByListId(user, ItemInfo.list, User) || user.isAdmin) {
    const newItem = returnItems(
      await Item.create({ ...ItemInfo, creator: user.id, status: false }),
    );
    pubsub.publish(`ITEM_ADDED`, {
      itemAdded: {
        ...newItem,
        __typename: 'Item',
      },
    });
    return newItem;
  }
  throw new Error('You do not have permission to create items in this list.');
};
