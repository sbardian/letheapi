import { ownerOfList } from './';
import { returnLists } from '../../database/utils';

export const authorizeDeleteList = async (user, listId, User, List) => {
  if (ownerOfList(user, listId, List)) {
    const userToUpdate = await User.findById(user.id);
    const { lists } = userToUpdate;
    const newLists = lists.splice(lists.indexOf(listId) - 1, 1);
    await User.update({ _id: user.id }, { $set: { lists: newLists } });
    return returnLists(await List.findByIdAndRemove(listId));
  }
  return new Error('You do not have permission to delete this list');
};
