import { AuthenticationError } from 'apollo-server';
import { returnItems } from '../../../database/utils';
import { userOfListByListId, isTokenValid } from '../checkAuth';
import { ITEM_ADDED } from '../../events';

export const createNewItem = async (
  root,
  { ItemInfo },
  { models: { Item, User, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if (userOfListByListId(user, ItemInfo.list, User) || user.isAdmin) {
    const newItem = returnItems(
      await Item.create({ ...ItemInfo, creator: user, status: false }),
    );
    pubsub.publish(ITEM_ADDED, {
      itemAdded: {
        ...newItem,
        __typename: 'Item',
      },
    });
    return newItem;
  }
  throw new Error('You do not have permission to create items in this list.');
};
