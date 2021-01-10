export const returnItems = (item) => ({
  id: item.id,
  title: item.title,
  creator: item.creator,
  list: item.list,
  status: item.status,
});

export const returnLists = (list) => ({
  id: list.id,
  title: list.title,
  owner: list.owner,
});

export const returnUsers = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  profileImageUrl: user.profileImageUrl,
  isAdmin: user.isAdmin,
});

export const returnProfileImage = (user) => ({
  mimetype: user.profileImage.mimetype,
  encoding: user.profileImage.encoding,
  filename: user.profileImage.filename,
});

export const returnInvitations = (invitation) => ({
  id: invitation.id,
  inviter: invitation.inviter,
  invitee: invitation.invitee,
  list: invitation.list,
  title: invitation.title,
});
