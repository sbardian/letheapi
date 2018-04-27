export const returnItems = item => ({
  id: item.id,
  title: item.title,
});

export const returnGroups = group => ({
  id: group.id,
  title: group.title,
  owner: group.owner,
});

export const returnUsers = user => ({
  id: user.id,
  username: user.username,
  email: user.email,
});
