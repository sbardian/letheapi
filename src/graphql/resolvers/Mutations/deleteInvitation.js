import { returnInvitations } from '../../../database/utils';
import { ownerOfList } from '../checkAuth';

export const deleteInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List }, user },
) => {
  const invitation = await Invitation.findById(invitationId);
  if (
    (await ownerOfList(user, invitation.list, List)) ||
    user.isAdmin ||
    user.id === invitation.invitee
  ) {
    return returnInvitations(await Invitation.findByIdAndRemove(invitationId));
  }
  throw new Error('You do not have permission to delete this invitation.');
};
