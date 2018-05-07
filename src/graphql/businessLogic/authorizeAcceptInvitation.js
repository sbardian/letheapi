import { returnInvitations } from '../../database/utils';
import { isAdmin } from './checkAuth';

export const authorizeAcceptInvitation = async (
  user,
  invitationId,
  Invitation,
  List,
  User,
) => {
  const invitation = await Invitation.findById(invitationId);
  if (invitation.invitee === user.id || isAdmin(user)) {
    const [{ lists }, { users, id }] = await Promise.all([
      User.findById(invitation.invitee),
      List.findById(invitation.list),
    ]);
    await User.findByIdAndUpdate(user.id, {
      lists: [...lists, invitation.list],
    });
    await List.findByIdAndUpdate(id, { users: [...users, invitation.invitee] });
    await Invitation.findByIdAndRemove(invitationId);
    return returnInvitations(invitation);
  }
  return new Error('You do not have permission to accept this invitation');
};
