import DataLoader from 'dataloader';

export const getListsLoader = ({ List }) =>
  new DataLoader(async (listIds) => {
    const lists = await List.find({ _id: { $in: listIds } });
    return listIds.map((listId) => lists.find(({ id }) => listId === id));
  });
