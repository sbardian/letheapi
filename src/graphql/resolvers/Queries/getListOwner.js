import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getListOwner = async (
  { owner },
  args,
  { loaders: { getListOwnerLoader }, models: { BlacklistedToken }, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getListOwnerLoader.load(owner);
};
