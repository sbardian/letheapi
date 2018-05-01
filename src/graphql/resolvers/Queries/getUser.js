import { authorizeGetUser } from '../../businessLogic';

export const getUser = (root, { userId }, { models: { User }, user }) =>
  authorizeGetUser(user, userId, User);
