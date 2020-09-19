export const userOfListByItemId = async (user, itemId, User, List) => {
  const activeUser = await User.findById(user.id);
  const list = await List.find({ 'items.id': itemId });
  if (activeUser.lists.includes(list.id)) {
    return true;
  }
  return false;
};

export const userOfListByListId = async (user, listId, User) => {
  const activeUser = await User.findById(user.id);
  if (activeUser.lists.includes(listId)) {
    return true;
  }
  return false;
};

export const getOnlySelf = (user, userId) => user.id === userId;

export const ownerOfList = async (user, listId, List) => {
  const list = await List.findById(listId);
  const { owner } = list;
  if (owner === user.id) {
    return true;
  }
  return false;
};

export const isTokenValid = async (token, BlacklistedToken) => {
  const result = await BlacklistedToken.find({ token });

  if (result.length) {
    return false;
  }
  return true;
};
