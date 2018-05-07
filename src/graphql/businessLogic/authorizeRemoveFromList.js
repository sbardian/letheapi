import { ownerOfList, isAdmin } from './';
import { returnUsers } from '../../database/utils';

export const authorizeRemoveFromList = async (
  user,
  listId,
  userId,
  User,
  List,
) => {
  let userToRemove;
  if (!userId || userId === user.id) {
    userToRemove = user.id;
  } else if ((await ownerOfList(user, listId, List)) || isAdmin(user)) {
    userToRemove = userId;
  } else {
    return new Error(
      'You do not have permission to remove this user from the list.',
    );
  }
  const [{ lists }, { users }] = await Promise.all([
    await User.findById(userToRemove),
    await List.findById(listId),
  ]);
  await User.findByIdAndUpdate(userToRemove, {
    lists: lists.filter(l => l !== listId),
  });
  await List.findByIdAndUpdate(listId, {
    users: users.filter(u => u !== userToRemove),
  });
  return returnUsers(await User.findById(userToRemove));
};
