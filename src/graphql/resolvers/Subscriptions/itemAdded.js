import { withFilter, AuthenticationError } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { userOfListByListId, isTokenValid } from '../checkAuth';
import { ITEM_ADDED } from '../../events';

export default {
  resolve: async (
    payload,
    { listId },
    { models: { User, BlacklistedToken }, user, token },
  ) => {
    console.log('>>>>>> : ', User);
    if (!(await isTokenValid(token, BlacklistedToken))) {
      throw new AuthenticationError('Invalid token');
    }
    if (user) {
      if (userOfListByListId(user, listId, User) || user.isAdmin) {
        return payload.itemAdded;
      }
      return new AuthenticationError(
        'You must be a member of the list to subscribe.',
      );
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([ITEM_ADDED]),
    (payload, variables) => payload.itemAdded.list === variables.listId,
  ),
};
