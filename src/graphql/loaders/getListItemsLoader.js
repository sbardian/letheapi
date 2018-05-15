import DataLoader from 'dataloader';
import { returnItems } from '../../database/utils';

export const getListItemsLoader = ({ Item }) =>
  new DataLoader(
    async listIds => {
      const items = await Item.find({ list: { $in: listIds } });
      let groupedArray = [];
      listIds.forEach(id =>
        groupedArray.push(items.filter(item => item.list === id)),
      );
      return groupedArray;
    },
    { cacheKeyFn: item => item },
  );
