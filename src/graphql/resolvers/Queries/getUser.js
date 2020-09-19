import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getUser = async (
  root,
  { userId },
  { loaders: { getUserLoader }, models: { BlacklistedToken }, user, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if (!user.isAdmin) {
    throw new Error(
      'This is an Admin only function, please use getMyInfo query.',
    );
  }
  const userFound = await getUserLoader.load(userId);
  if (!userFound) {
    throw new Error(`User ID ${userId} not found`);
  }
  return userFound;
};
