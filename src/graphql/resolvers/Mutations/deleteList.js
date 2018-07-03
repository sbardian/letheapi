import { returnLists } from '../../../database/utils';
import { ownerOfList } from '../checkAuth';
import { pubsub } from '../../../server/server';

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
    const deletedList = returnLists(await List.findByIdAndRemove(listId));
    pubsub.publish(`LIST_DELETED`, {
      listDeleted: {
        ...deletedList,
        __typename: 'List',
      },
    });
    // return returnLists(await List.findByIdAndRemove(listId));
    return deletedList;
  }
  throw new Error('You do not have permission to delete this list.');
};
