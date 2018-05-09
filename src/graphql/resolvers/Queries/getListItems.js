import { returnItems } from '../../../database/utils';

export const getListItems = async (
  { id },
  { limit = 500 },
  { models: { Item } },
) =>
  (await Item.find({})
    .where('list')
    .equals(id)
    .limit(limit)).map(returnItems);
