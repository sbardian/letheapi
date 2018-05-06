import { returnInvitations } from '../../database/utils';

export const authorizeAcceptInvitation = async (
  user,
  invitationId,
  Invitation,
  List,
  User,
) => {
  const invitation = await Invitation.findById(invitationId);
  if (invitation.invitee === user.id || isAdmin(user)) {
    const updateUser = await User.findById(invitation.invitee);
    const updateList = await List.findById(invitation.list);
    const { lists } = updateUser;
    const { users } = updateList;
    await User.update(
      { _id: user.id },
      { $set: { lists: [...lists, invitation.list] } },
    );
    await List.update(
      { _id: updateList.id },
      { $set: { users: [...users, invitation.invitee] } },
    );
    await Invitation.findByIdAndRemove(invitationId);
    return returnInvitations(invitation);
  }
  return new Error('You do not have permission to accept this invitation');
};
