import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { returnInvitations } from '../../../database/utils';
import { INVITATION_DELETED } from '../../events';
import { isTokenValid } from '../checkAuth';

export const acceptInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List, User, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  const invitation = await Invitation.findById(invitationId);
  if (invitation.invitee === user.id || user.isAdmin) {
    const [{ lists }, { users, id }] = await Promise.all([
      User.findById(invitation.invitee),
      List.findById(invitation.list),
    ]);
    await User.findByIdAndUpdate(user.id, {
      lists: [...lists, invitation.list],
    });
    await List.findByIdAndUpdate(id, {
      users: [...users, invitation.invitee],
    });
    const acceptedInvitation = returnInvitations(
      await Invitation.findByIdAndRemove(invitationId),
    );
    pubsub.publish(INVITATION_DELETED, {
      invitationDeleted: {
        ...acceptedInvitation,
        __typename: 'Invitation',
      },
    });
    return acceptedInvitation;
  }
  throw new ForbiddenError(
    'You do not have permission to accept this invitation',
  );
};
