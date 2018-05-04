import { authorizeGetUser } from '../../businessLogic';

export const getUser = (
  root,
  { userId },
  { models: { User }, user, isAdmin },
) => authorizeGetUser(user, userId, User);
