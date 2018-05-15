export const getUser = async (
  root,
  { userId },
  { models: { User }, loaders: { getUserLoader }, user },
) => {
  if (!user.isAdmin) {
    throw new Error(
      'This is an Admin only function, please use getMyInfo query',
    );
  }
  const userFound = await getUserLoader.load(userId);
  if (!userFound) {
    throw new Error(`User ID ${userId} not found`);
  }
  return userFound;
};
