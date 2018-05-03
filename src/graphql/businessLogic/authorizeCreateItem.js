import { userOfListByListId } from './';
import { returnItems } from '../../database/utils';

export const authorizeCreateItem = async (user, ItemInfo, Item, User) => {
  if (userOfListByListId(user, ItemInfo.list, User)) {
    return returnItems(await Item.create({ ...ItemInfo, creator: user.id }));
  } else {
    return new Error('You do not have permission to create items in this list');
  }
};
