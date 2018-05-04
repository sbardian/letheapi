import { getOnlySelf, isAdmin } from './';
import { returnLists } from '../../database/utils';

export const authorizeGetLists = async (
  user,
  userId,
  limit,
  contains_title,
  id_is,
  List,
  User,
) => {
  if (isAdmin(user)) {
    return (await List.find({
      ...(userId && { users: userId }),
      ...(contains_title && {
        title: { $regex: `${contains_title}`, $options: 'i' },
      }),
      ...(id_is && {
        _id: id_is,
      }),
    }).limit(limit)).map(returnLists);
  } else if (getOnlySelf(user, userId) || !userId) {
    return (await List.find({
      users: user.id,
      ...(contains_title && {
        title: { $regex: `${contains_title}`, $options: 'i' },
      }),
      ...(id_is && {
        _id: id_is,
      }),
    }).limit(limit)).map(returnLists);
  } else {
    return new Error('You are only allowed to retrieve your own lists');
  }
};
