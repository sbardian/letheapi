import { AuthenticationError } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { userOfListByListId } from '../checkAuth';
import { LIST_DELETED } from '../../events';

export default {
  resolve: (payload, args, { models: { User }, user }) => {
    if (user) {
      if (
        userOfListByListId(user, payload.listDeleted.id, User) ||
        user.isAdmin
      ) {
        return payload.listDeleted;
      }
      return new AuthenticationError(
        'You must be a member of the list to subscribe.',
      );
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: () => pubsub.asyncIterator([LIST_DELETED]),
};
