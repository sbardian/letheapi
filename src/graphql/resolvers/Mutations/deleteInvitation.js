import { returnInvitations } from '../../../database/utils';
import { ownerOfList } from '../checkAuth';
import { INVITATION_DELETED } from '../../events';

export const deleteInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List }, user, pubsub },
) => {
  const invitation = await Invitation.findById(invitationId);
  if (
    (await ownerOfList(user, invitation.list, List)) ||
    user.isAdmin ||
    user.id === invitation.invitee.id
  ) {
    const deletedInvitation = returnInvitations(
      await Invitation.findByIdAndRemove(invitationId),
    );
    pubsub.publish(INVITATION_DELETED, {
      invitationDeleted: {
        ...deletedInvitation,
        __typename: 'Invitation',
      },
    });
    return deletedInvitation;
  }
  throw new Error('You do not have permission to delete this invitation.');
};
