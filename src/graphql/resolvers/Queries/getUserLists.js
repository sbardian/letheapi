import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getUserLists = async (
  { id },
  args,
  { loaders: { getUserListsLoader }, models: { BlacklistedToken }, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getUserListsLoader.load(id);
};
