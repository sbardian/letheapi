import { AuthenticationError } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { userOfListByListId, isTokenValid } from '../checkAuth';
import { LIST_ADDED } from '../../events';

export default {
  resolve: async (
    payload,
    args,
    { models: { User, BlacklistedToken }, user, token },
  ) => {
    if (!(await isTokenValid(token, BlacklistedToken))) {
      throw new AuthenticationError('Invalid token');
    }
    if (user) {
      if (
        userOfListByListId(user, payload.listAdded.id, User) ||
        user.isAdmin
      ) {
        return payload.listAdded;
      }
      return new AuthenticationError(
        'You must be a member of the list to subscribe.',
      );
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: () => pubsub.asyncIterator([LIST_ADDED]),
};
