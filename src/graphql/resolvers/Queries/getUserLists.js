export const getUserLists = async (
  { id },
  args,
  { loaders: { getUserListsLoader } },
) => getUserListsLoader.load(id);
