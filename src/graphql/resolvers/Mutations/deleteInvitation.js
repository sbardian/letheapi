import { returnInvitations } from '../../../database/utils';
import { isAdmin, ownerOfList } from '../checkAuth';

export const deleteInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List }, user },
) => {
  const invitation = await Invitation.findById(invitationId);
  if (
    ownerOfList(user, invitation.list, List) ||
    isAdmin(user) ||
    user.id === invitation.invitee
  ) {
    return returnInvitations(await Invitation.findByIdAndRemove(invitationId));
  }
  return new Error('You do not have permission to delete this invitation.');
};
