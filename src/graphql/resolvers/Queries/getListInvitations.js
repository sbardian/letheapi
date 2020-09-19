import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getListInvitations = async (
  { id },
  args,
  {
    loaders: { getListInvitationsLoader },
    models: { BlacklistedToken },
    token,
  },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getListInvitationsLoader.load(id);
};
