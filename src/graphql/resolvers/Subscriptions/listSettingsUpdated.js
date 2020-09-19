import { AuthenticationError, withFilter } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { userOfListByListId } from '../checkAuth';
import { LIST_SETTINGS_UPDATED } from '../../events';

export default {
  resolve: (payload, { id_is }, { models: { User }, user }) => {
    if (user) {
      if (userOfListByListId(user, id_is, User) || user.isAdmin) {
        return payload.listSettingsUpdated;
      }
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([LIST_SETTINGS_UPDATED]),
    (payload, variables) => payload.listSettingsUpdated.id === variables.listId,
  ),
};
