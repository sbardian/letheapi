import DataLoader from 'dataloader';

export const getListInvitationsLoader = ({ Invitation }) =>
  new DataLoader(async listIds => {
    const invitations = await Invitation.find({ list: { $in: listIds } });
    return listIds.reduce(
      (newArray, id) => [
        invitations.filter(invitation => invitation.list === id),
      ],
      [],
    );
  });
