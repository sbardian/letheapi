import { AuthenticationError, withFilter } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { INVITATION_DELETED } from '../../events';

export default {
  resolve: (payload, args, { user }) => {
    if (user) {
      return payload.invitationDeleted;
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([INVITATION_DELETED]),
    (payload, variables, { user }) =>
      payload.invitationDeleted.invitee.id === user.id,
  ),
};
