import { userOfListByItemId } from '../checkAuth';

export const updateItem = async (
  root,
  { itemId, title },
  { models: { Item, List, User }, user },
) => {
  if (userOfListByItemId(user, itemId, User, List) || user.isAdmin) {
    return Item.findByIdAndUpdate(itemId, { title }, { new: true });
  }
  throw new Error('You do not have permission to update this item.');
};
