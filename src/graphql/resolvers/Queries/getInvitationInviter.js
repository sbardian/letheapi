import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getInvitationInviter = async (
  { inviter: inviterId },
  args,
  {
    loaders: { getInvitationInviterLoader },
    models: { BlacklistedToken },
    token,
  },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getInvitationInviterLoader.load(inviterId);
};
