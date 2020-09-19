import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getListItems = async (
  { id },
  args,
  { loaders: { getListItemsLoader }, models: { BlacklistedToken }, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getListItemsLoader.load(id);
};
