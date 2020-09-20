export const logout = async (
  root,
  args,
  { models: { BlacklistedToken }, token },
) => {
  if (token) {
    const blacklistedToken = await BlacklistedToken.create({
      token,
    });
    return blacklistedToken;
  }
  return new Error('You must be logged in to logout');
};
