import { getOnlySelf } from './';
import { returnLists } from '../../database/utils';

export const authorizeGetLists = async (
  user,
  userId,
  limit,
  contains_title,
  List,
  User,
) => {
  if (getOnlySelf(user, userId)) {
    return (await List.find({
      owner: userId,
      ...(contains_title && {
        title: { $regex: `${contains_title}`, $options: 'i' },
      }),
    }).limit(limit)).map(returnLists);
  } else {
    return new Error('You are only allowed to retrieve your own lists');
  }
};
