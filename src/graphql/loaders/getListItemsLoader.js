import DataLoader from 'dataloader';
import { returnItems } from '../../database/utils';

export const getListItemsLoader = ({ Item }) =>
  new DataLoader(async listIds => {
    const items = await Item.find({ list: { $in: listIds } });
    return listIds.reduce(
      (newArray, id) => [...newArray, items.filter(item => item.list === id)],
      [],
    );
  });
