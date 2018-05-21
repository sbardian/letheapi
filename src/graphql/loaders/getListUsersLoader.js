import DataLoader from 'dataloader';

export const getListUsersLoader = ({ User }) =>
  new DataLoader(async listIds => {
    console.log('listIds = ', listIds);
    console.log('all users = ', await User.find());
    const users = await User.find({ lists: { $in: listIds } });
    console.log('users = ', users);
    return listIds.reduce(
      (newArray, id) => [
        ...newArray,
        users.filter(user => user.lists.find(userId => userId === id)),
      ],
      [],
    );
  });
