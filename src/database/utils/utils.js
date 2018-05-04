export const returnItems = item => ({
  id: item.id,
  title: item.title,
  creator: item.creator,
  list: item.list,
});

export const returnLists = list => ({
  id: list.id,
  title: list.title,
  owner: list.owner,
});

export const returnUsers = user => ({
  id: user.id,
  username: user.username,
  email: user.email,
});

export const returnInvitations = invitation => ({
  id: invitation.id,
  inviter: invitation.inviter,
  invitee: invitation.invitee,
  list: invitation.list,
  title: invitation.title,
});
