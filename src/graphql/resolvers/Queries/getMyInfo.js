export const getMyInfo = async (
  root,
  args,
  { loaders: { getMyInfoLoader }, user },
) => getMyInfoLoader.load(user.id);
