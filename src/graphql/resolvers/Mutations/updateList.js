import { ownerOfList } from '../checkAuth';

export const updateList = async (
  root,
  { listId, title },
  { models: { List }, user },
) => {
  if ((await ownerOfList(user, listId, List)) || user.isAdmin) {
    return await List.findByIdAndUpdate(listId, { title }, { new: true });
  }
  throw new Error('You do not have permission to update this list.');
};
