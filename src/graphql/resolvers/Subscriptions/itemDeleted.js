import { AuthenticationError } from 'apollo-server';
import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../../../server/createApolloServers';
import { userOfListByListId, isTokenValid } from '../checkAuth';
import { ITEM_DELETED } from '../../events';

export default {
  resolve: async (
    payload,
    { listId },
    { models: { User, BlacklistedToken }, user, token },
  ) => {
    if (!(await isTokenValid(token, BlacklistedToken))) {
      throw new AuthenticationError('Invalid token');
    }
    if (user) {
      if (userOfListByListId(user, listId, User) || user.isAdmin) {
        return payload.itemDeleted;
      }
      return new AuthenticationError(
        'You must be a member of the list to subscribe.',
      );
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([ITEM_DELETED]),
    (payload, variables) => {
      const result = payload.itemDeleted.list === variables.listId;
      return result;
    },
  ),
};
