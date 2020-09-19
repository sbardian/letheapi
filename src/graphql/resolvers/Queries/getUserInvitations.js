import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getUserInvitations = async (
  { id },
  args,
  {
    loaders: { getUserInvitationsLoader },
    models: { BlacklistedToken },
    token,
  },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getUserInvitationsLoader.load(id);
};
