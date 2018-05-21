import DataLoader from 'dataloader';
import { returnLists } from '../../database/utils';

export const getUserListsLoader = ({ List }) =>
  new DataLoader(async userIds => {
    const lists = await List.find({ users: { $in: userIds } });
    return userIds.reduce(
      (newArray, id) => [
        ...newArray,
        lists.filter(list =>
          returnLists(list.users.find(userId => userId === id)),
        ),
      ],
      [],
    );
  });
