import DataLoader from 'dataloader';

export const getListInvitationsLoader = ({ Invitation }) =>
  new DataLoader(async (listIds) => {
    const invitations = await Invitation.find({
      'list.id': { $in: listIds },
    });
    return listIds.reduce(
      (newArray, id) => [
        ...newArray,
        invitations.filter((invitation) => invitation.list.id === id),
      ],
      [],
    );
  });
