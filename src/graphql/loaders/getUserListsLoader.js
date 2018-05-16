import DataLoader from 'dataloader';

export const getUserListsLoader = ({ List }) =>
  new DataLoader(async userIds => {
    const lists = await List.find({ users: { $in: userIds } });
    return userIds.reduce(
      (newArray, id) => [
        ...newArray,
        lists.filter(list => list.users.find(userId => userId === id)),
      ],
      [],
    );
  });
