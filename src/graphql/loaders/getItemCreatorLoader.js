import DataLoader from 'dataloader';

export const getItemCreatorLoader = ({ User }) =>
  new DataLoader(async (userIds) => {
    const users = await User.find({ _id: { $in: userIds } });
    return userIds.map((userId) => users.find(({ id }) => userId === id));
  });
