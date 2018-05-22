import DataLoader from 'dataloader';

export const getListUsersLoader = ({ User }) =>
  new DataLoader(async listIds => {
    const users = await User.find({ lists: { $in: listIds } });
    return listIds.reduce(
      (newArray, id) => [
        ...newArray,
        users.filter(user => user.lists.find(userId => userId === id)),
      ],
      [],
    );
  });
