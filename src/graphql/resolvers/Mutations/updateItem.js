import { AuthenticationError } from 'apollo-server';
import { userOfListByItemId, isTokenValid } from '../checkAuth';
import { returnItems } from '../../../database/utils';
import { ITEM_EDITED } from '../../events';

export const updateItem = async (
  root,
  { itemId, title, status },
  { models: { Item, List, User, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if (userOfListByItemId(user, itemId, User, List) || user.isAdmin) {
    const editedItem = returnItems(
      await Item.findByIdAndUpdate(itemId, { title, status }, { new: true }),
    );

    console.log({ editedItem });

    pubsub.publish(ITEM_EDITED, {
      itemEdited: {
        ...editedItem,
        __typename: 'Item',
      },
    });

    return editedItem;
  }
  throw new Error('You do not have permission to update this item.');
};
