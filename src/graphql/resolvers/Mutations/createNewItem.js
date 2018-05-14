import { returnItems } from '../../../database/utils';
import { userOfListByListId } from '../checkAuth';

export const createNewItem = async (
  root,
  { ItemInfo },
  { models: { Item, User }, user },
) => {
  if (userOfListByListId(user, ItemInfo.list, User) || user.isAdmin) {
    return returnItems(await Item.create({ ...ItemInfo, creator: user.id }));
  } else {
    return new Error('You do not have permission to create items in this list');
  }
};
