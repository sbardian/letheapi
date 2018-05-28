export const getUser = async (
  root,
  { userId },
  { loaders: { getUserLoader }, user },
) => {
  if (!user) {
    throw new Error('You must be a valid user to perform this query.');
  }
  const userFound = await getUserLoader.load(userId);
  if (!userFound) {
    throw new Error(`User ID ${userId} not found`);
  }
  return userFound;
};
