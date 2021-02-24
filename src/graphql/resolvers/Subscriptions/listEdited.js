import { AuthenticationError, withFilter } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { userOfListByListId, isTokenValid } from '../checkAuth';
import { LIST_EDITED } from '../../events';

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
        return payload.listEdited;
      }
      return new AuthenticationError(
        'You must be a member of the list to subscribe.',
      );
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([LIST_EDITED]),
    (payload, variables) => payload.listEdited.id === variables.listId,
  ),
};
