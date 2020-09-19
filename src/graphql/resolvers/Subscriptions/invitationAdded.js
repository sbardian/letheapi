import { AuthenticationError, withFilter } from 'apollo-server';
import { pubsub } from '../../../server/createApolloServer';
import { INVITATION_ADDED } from '../../events';

export default {
  resolve: (payload, args, { user }) => {
    if (user) {
      return payload.invitationAdded;
    }
    return new AuthenticationError('Authentication failed.');
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator([INVITATION_ADDED]),
    (payload, variables, { user }) =>
      payload.invitationAdded.invitee.id === user.id,
  ),
};
