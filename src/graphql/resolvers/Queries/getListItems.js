export const getListItems = async (
  { id },
  args,
  { loaders: { getListItemsLoader } },
) => getListItemsLoader.load(id);
