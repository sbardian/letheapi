import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getItemCreator = async (
  { creator },
  args,
  { loaders: { getItemCreatorLoader }, models: { BlacklistedToken }, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getItemCreatorLoader.load(creator);
};
