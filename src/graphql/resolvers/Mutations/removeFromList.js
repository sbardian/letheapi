import { AuthenticationError } from 'apollo-server';
import { returnUsers } from '../../../database/utils';
import { ownerOfList, isTokenValid } from '../checkAuth';

export const removeFromList = async (
  root,
  { listId, userId },
  { models: { User, List, BlacklistedToken }, user, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  let userToRemove;
  // TODO: errors when user removes themselves. . . should we allow?
  if (!userId || userId === user.id) {
    userToRemove = user.id;
  } else if ((await ownerOfList(user, listId, List)) || user.isAdmin) {
    userToRemove = userId;
  } else {
    throw new Error(
      'You do not have permission to remove this user from the list.',
    );
  }
  const [{ lists }, { users }] = await Promise.all([
    await User.findById(userToRemove),
    await List.findById(listId),
  ]);
  await User.findByIdAndUpdate(userToRemove, {
    lists: lists.filter((l) => l !== listId),
  });
  await List.findByIdAndUpdate(listId, {
    users: users.filter((u) => u !== userToRemove),
  });
  return returnUsers(await User.findById(userToRemove));
};
