import DataLoader from 'dataloader';

export const getUserInvitationsLoader = ({ Invitation }) =>
  new DataLoader(async (userIds) => {
    const invitations = await Invitation.find({
      invitee: { $in: userIds },
    });
    return userIds.reduce(
      (newArray, id) => [
        ...newArray,
        invitations.filter((invitation) => invitation.invitee === id),
      ],
      [],
    );
  });
