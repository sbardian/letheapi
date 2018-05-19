import { getOnlySelf } from '../checkAuth';

export const getLists = async (
  root,
  { userId, limit, contains_title, id_is },
  { loaders: { getListsLoader }, models: { List }, user },
) => {
  let lists;
  if (user.isAdmin) {
    lists = await List.find({
      ...(userId && { users: userId }),
      ...(contains_title && {
        title: { $regex: `${contains_title}`, $options: 'i' },
      }),
      ...(id_is && {
        _id: id_is,
      }),
    }).limit(limit);
    return lists.map(list => getListsLoader.load(list.id));
  } else if (getOnlySelf(user, userId) || !userId) {
    lists = await List.find({
      users: user.id,
      ...(contains_title && {
        title: { $regex: `${contains_title}`, $options: 'i' },
      }),
      ...(id_is && {
        _id: id_is,
      }),
    }).limit(limit);
    return lists.map(list => getListsLoader.load(list.id));
  }
  throw new Error('You are only allowed to retrieve your own lists');
};
