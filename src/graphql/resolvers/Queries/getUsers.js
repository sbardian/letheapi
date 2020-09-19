// TODO: don't return a user's password property
import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';

export const getUsers = async (
  root,
  args,
  {
    loaders: { getUserLoader },
    models: { User, BlacklistedToken },
    user,
    token,
  },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if (!user.isAdmin) {
    throw new Error(
      'This is an Admin only function, please use getMyInfo query',
    );
  }
  return (await User.find()).map(({ id }) => getUserLoader.load(id));
};
