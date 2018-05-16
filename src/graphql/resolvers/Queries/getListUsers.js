export const getListUsers = async (
  { id },
  args,
  { loaders: { getListUsersLoader } },
) => getListUsersLoader.load(id);
