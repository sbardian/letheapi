import { returnInvitations } from '../../../database/utils';
import { INVITATION_DELETED } from '../../events';

export const acceptInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List, User }, user, pubsub },
) => {
  const invitation = await Invitation.findById(invitationId);
  if (invitation.invitee.id === user.id || user.isAdmin) {
    const [{ lists }, { users, id }] = await Promise.all([
      User.findById(invitation.invitee.id),
      List.findById(invitation.list),
    ]);
    await User.findByIdAndUpdate(user.id, {
      lists: [...lists, invitation.list],
    });
    await List.findByIdAndUpdate(id, {
      users: [...users, invitation.invitee.id],
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
  throw new Error('You do not have permission to accept this invitation');
};
