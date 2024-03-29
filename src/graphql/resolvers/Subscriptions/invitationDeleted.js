import { AuthenticationError } from 'apollo-server';
import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../../../server/createApolloServers';
import { isTokenValid } from '../checkAuth';
import { INVITATION_DELETED } from '../../events';

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
      return payload.invitationDeleted;
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([INVITATION_DELETED]),
    (payload, variables, { user }) =>
      payload.invitationDeleted.invitee === user.id,
  ),
};
