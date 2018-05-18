import DataLoader from 'dataloader';

export const getListsLoader = ({ List, User }) =>
  new DataLoader(async listIds => {
    const lists = List.find({ _id: { $in: listIds } });
    return listIds.reduce((newArray, id) => [
      ...newArray,
      lists.filter(list => list.id === listIds),
    ]);
  });
