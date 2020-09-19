import { AuthenticationError, withFilter } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { isTokenValid } from '../checkAuth';
import { INVITATION_ADDED } from '../../events';

export default {
  resolve: async (
    payload,
    args,
    { models: { BlacklistedToken }, user, token },
  ) => {
    if (!(await isTokenValid(token, BlacklistedToken))) {
      throw new AuthenticationError('Invalid token');
    }
    if (user) {
      return payload.invitationAdded;
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([INVITATION_ADDED]),
    (payload, variables, { user }) =>
      payload.invitationAdded.invitee.id === user.id,
  ),
};
