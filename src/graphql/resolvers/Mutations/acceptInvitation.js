import { returnInvitations } from '../../../database/utils';

export const acceptInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List, User }, user },
) => {
  const invitation = await Invitation.findById(invitationId);
  if (invitation.invitee === user.id || user.isAdmin) {
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
