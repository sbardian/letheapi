import { AuthenticationError } from 'apollo-server';
import { returnLists } from '../../../database/utils';
import { ownerOfList, isTokenValid } from '../checkAuth';
import { LIST_DELETED } from '../../events';

export const deleteList = async (
  root,
  { listId },
  { models: { User, List, Item, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if ((await ownerOfList(user, listId, List)) || user.isAdmin) {
    const usersToUpdate = await User.find({ lists: listId });
    usersToUpdate.forEach(async (currentUser) => {
      const { lists } = currentUser;
      await User.findByIdAndUpdate(currentUser.id, {
        lists: lists.filter((l) => l !== listId),
      });
    });
    const deletedList = returnLists(await List.findByIdAndRemove(listId));
    await Item.deleteMany({ list: listId });
    pubsub.publish(LIST_DELETED, {
      listDeleted: {
        ...deletedList,
        __typename: 'List',
      },
    });
    return deletedList;
  }
  throw new Error('You do not have permission to delete this list.');
};
