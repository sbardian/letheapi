import { AuthenticationError } from 'apollo-server';
import { ownerOfList, isTokenValid } from '../checkAuth';

export const updateList = async (
  root,
  { listId, title },
  { models: { List, BlacklistedToken }, user, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if ((await ownerOfList(user, listId, List)) || user.isAdmin) {
    return List.findByIdAndUpdate(listId, { title }, { new: true });
  }
  throw new Error('You do not have permission to update this list.');
};
