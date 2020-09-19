import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getMyInfo = async (
  root,
  args,
  { loaders: { getMyInfoLoader }, models: { BlacklistedToken }, user, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  return getMyInfoLoader.load(user.id);
};
