import { withFilter, AuthenticationError } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { userOfListByListId } from '../checkAuth';
import { ITEM_EDITED } from '../../events';

export default {
  resolve: (payload, { listId }, { models: { User }, user }) => {
    if (user) {
      if (userOfListByListId(user, listId, User) || user.isAdmin) {
        return payload.itemEdited;
      }
      return new AuthenticationError(
        'You must be a member of the list to subscribe.',
      );
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([ITEM_EDITED]),
    (payload, variables) => payload.itemEdited.list === variables.listId,
  ),
};
