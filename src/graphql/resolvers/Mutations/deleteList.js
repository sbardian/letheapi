import { returnLists } from '../../../database/utils';
import { isAdmin, ownerOfList } from '../checkAuth';

export const deleteList = async (
  root,
  { listId },
  { models: { User, List }, user },
) => {
  if ((await ownerOfList(user, listId, List)) || isAdmin(user)) {
    const userToUpdate = await User.findById(user.id);
    const { lists } = userToUpdate;
    const newLists = lists.splice(lists.indexOf(listId) - 1, 1);
    await User.update({ _id: user.id }, { $set: { lists: newLists } });
    return returnLists(await List.findByIdAndRemove(listId));
  }
  return new Error('You do not have permission to delete this list');
};
