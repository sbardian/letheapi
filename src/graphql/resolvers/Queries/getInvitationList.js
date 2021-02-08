import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getInvitationList = async (
  { list: listId },
  args,
  { loaders: { getInvitationListLoader }, models: { BlacklistedToken }, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getInvitationListLoader.load(listId);
};
