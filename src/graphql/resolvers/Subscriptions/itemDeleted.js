import { withFilter, AuthenticationError } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { userOfListByListId } from '../checkAuth';
import { ITEM_DELETED } from '../../events';

export default {
  resolve: (payload, { listId }, { models: { User }, user }) => {
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
    (payload, variables) => payload.itemDeleted.list === variables.listId,
  ),
};
