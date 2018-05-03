import { getOnlySelf } from './';
import { returnLists } from '../../database/utils';

export const authorizeGetLists = async (
  user,
  userId,
  limit,
  title_contains,
  List,
  User,
) => {
  if (getOnlySelf(user, userId)) {
    return (await List.find({
      owner: userId,
      ...(title_contains && {
        title: { $regex: `${title_contains}`, $options: 'i' },
      }),
    }).limit(limit)).map(returnLists);
  } else {
    return new Error('You are only allowed to retrieve your own lists');
  }
};
