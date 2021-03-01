import { AuthenticationError, ForbiddenError } from 'apollo-server';
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
  // requesting user is owner trying to remove themselves
  if (user.id === userId && (await ownerOfList(user, listId, List))) {
    throw new ForbiddenError(
      'You are the owner of this list and cannot be removed, delete the list instead.',
    );
  }
  // requesting user is not admin or owner of the list
  if (
    !user.isAdmin &&
    !(await ownerOfList(user, listId, List)) &&
    userId !== user.id
  ) {
    throw new Error(
      'You do not have permission to remove this user from the list.',
    );
  }
  // user to remove is owner
  console.log('> ', await ownerOfList({ id: userId }, listId, List));
  if (await ownerOfList({ id: userId }, listId, List)) {
    throw new ForbiddenError('The owner of a list cannot be removed.');
  }
  const userToRemove = userId;

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
