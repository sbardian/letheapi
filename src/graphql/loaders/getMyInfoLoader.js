import DataLoader from 'dataloader';
import { returnUsers } from '../../database/utils';

export const getMyInfoLoader = ({ User }) =>
  new DataLoader(async userIds => {
    const users = await User.find({ _id: { $in: userIds } });
    return userIds.map(userId =>
      returnUsers(users.find(({ id }) => userId === id)),
    );
  });
