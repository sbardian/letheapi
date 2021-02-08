import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getInvitationInvitee = async (
  { invitee: inviteeId },
  args,
  {
    loaders: { getInvitationInviteeLoader },
    models: { BlacklistedToken },
    token,
  },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getInvitationInviteeLoader.load(inviteeId);
};
