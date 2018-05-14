import { returnLists } from '../../../database/utils';
import { ownerOfList } from '../checkAuth';

export const deleteList = async (
  root,
  { listId },
  { models: { User, List }, user },
) => {
  if ((await ownerOfList(user, listId, List)) || user.isAdmin) {
    const usersToUpdate = await User.find({ lists: listId });
    usersToUpdate.forEach(async currentUser => {
      const { lists } = currentUser;
      await User.findByIdAndUpdate(currentUser.id, {
        lists: lists.filter(l => l !== listId),
      });
    });
    return returnLists(await List.findByIdAndRemove(listId));
  }
  throw new Error('You do not have permission to delete this list.');
};
