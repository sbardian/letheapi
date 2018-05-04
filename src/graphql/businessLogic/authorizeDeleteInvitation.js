import { ownerOfList, isAdmin } from './';
import { returnInvitations } from '../../database/utils';

export const authorizeDeleteInvitation = async (
  user,
  invitationId,
  Invitation,
  List,
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
