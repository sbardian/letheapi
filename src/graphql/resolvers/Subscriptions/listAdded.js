import { AuthenticationError } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServers';
import { ownerOfList, isTokenValid } from '../checkAuth';
import { LIST_ADDED } from '../../events';

export default {
  resolve: async (
    payload,
    args,
    { models: { List, BlacklistedToken }, user, token },
  ) => {
    if (!(await isTokenValid(token, BlacklistedToken))) {
      throw new AuthenticationError('Invalid token');
    }
    if (user) {
      if (ownerOfList(user, payload.listAdded.id, List) || user.isAdmin) {
        return payload.listAdded;
      }
      return new AuthenticationError(
        'You must be the owner of the list to subscribe.',
      );
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: () => pubsub.asyncIterator([LIST_ADDED]),
};
