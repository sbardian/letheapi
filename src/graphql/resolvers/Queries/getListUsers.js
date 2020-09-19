import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getListUsers = async (
  { id },
  args,
  { loaders: { getListUsersLoader }, models: { BlacklistedToken }, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getListUsersLoader.load(id);
};
