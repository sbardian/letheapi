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
